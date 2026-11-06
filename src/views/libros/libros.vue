<template>
<div>
    <vx-card>
        <vs-popup fullscreen title="Generar link" :active.sync="popupLinkLibro">
            <div class="vx-row mb-base p-3">
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <vs-input type="number" class="w-full" label="Página inicio" v-model="link.pag_ini" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <vs-input type="number" class="w-full" label="Página fin" v-model="link.pag_fin" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="color: gray; font-size: 12px;">Fecha inicio</div>
                    <flat-pickr class="w-full" :config="configdateTimePicker" v-model="link.fecha_inicio" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="color: gray; font-size: 12px;">Fecha caducidad</div>
                    <flat-pickr class="w-full" :config="configdateTimePicker" v-model="link.fecha_caducidad" />
                </div>
                <div class="vx-col w-full">
                    <vs-button @click="guardarLink()">Guardar link</vs-button>
                </div>
            </div>
            <vs-divider></vs-divider>
            <vs-table max-items="10" stripe search pagination :data="links" class="mb-3">
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th>Pág inicio</vs-th>
                    <vs-th>Pág fin</vs-th>
                    <vs-th>Fecha inicio</vs-th>
                    <vs-th>Fecha fin</vs-th>
                    <vs-th>Recurso externo</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td> {{indextr+1}} </vs-td>
                        <vs-td> {{data[indextr].pag_ini}} </vs-td>
                        <vs-td> {{data[indextr].pag_fin}} </vs-td>
                        <vs-td> {{data[indextr].fecha_ini}} </vs-td>
                        <vs-td> {{data[indextr].fecha_fin}} </vs-td>
                        <vs-td>
                            <div v-if="tr.recurso_externo == '0'">
                                <vs-chip color="warning">No</vs-chip>
                            </div>
                            <div v-else>
                                <vs-chip color="warning">Si</vs-chip><br><br>
                                <small>Asignado a {{ tr.nombreInstitucion }}</small>
                            </div>
                        </vs-td>
                        <vs-td align="center">
                            <vx-tooltip style="display: inline-block;" text="Copiar link" position="top" color="success">
                                <vs-button size="small" class="modal-default-button" color="success" @click="copiarLink(data[indextr])" type="line" icon-pack="feather" icon="icon-copy"> </vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-popup>
        <div class="con-tab-ejemplo">
            <div>
                <!-- Fila 1: botones de acción -->
                <div class="libros-toolbar">
                    <vs-button color="dark" v-if="(permisoRoot || userAdmin)" icon="add" @click="limpiar();popupGuardar=true;title='Guardar';getGrupoProducto();listaSeries();" type="line" class="toolbar-btn">Añadir producto</vs-button>
                    <vs-button color="success" v-if="arreglosLibros.length > 0" icon-pack="feather" icon="icon-download" @click="exportarExcel()" type="line" class="toolbar-btn">Exportar a Excel</vs-button>
                </div>

                <!-- Fila 2: filtro de palabras excluidas -->
                <div v-if="arreglosLibros.length > 0" class="libros-filter-row">
                    <!-- ===== FILTRO DE PALABRAS EXCLUIDAS ===== -->
                    <div class="palabras-excluidas-wrapper">
                        <!-- Cabecera: label + badge contador + botón limpiar -->
                        <div class="palabras-excluidas-header">
                            <div class="palabras-excluidas-label">
                                <i class="feather icon-filter palabras-excluidas-icon"></i>
                                <span>Excluir libros de la lista</span>
                                <span v-if="palabrasExcluidas.length > 0" class="palabras-badge">
                                    {{ palabrasExcluidas.length }} activ{{ palabrasExcluidas.length === 1 ? 'a' : 'as' }}
                                </span>
                            </div>
                            <button
                                v-if="palabrasExcluidas.length > 0"
                                class="palabras-clear-btn"
                                @click="palabrasExcluidas = []"
                                title="Eliminar todos los filtros"
                            >
                                <i class="feather icon-trash-2"></i>
                                Limpiar todo
                            </button>
                        </div>

                        <!-- Select taggable -->
                        <v-select
                            multiple
                            v-model="palabrasExcluidas"
                            taggable
                            push-tags
                            placeholder="Escriba una palabra y presione Enter para excluir..."
                            :noDrop="true"
                            class="palabras-excluidas-select"
                        />

                        <!-- Hint informativo siempre visible -->
                        <p class="palabras-excluidas-hint">
                            <i class="feather icon-info"></i>
                            Los libros que contengan las palabras ingresadas serán <strong>ocultados</strong> de la tabla. Escriba y presione <kbd>Enter</kbd> para agregar. Haga clic en la <strong>✕</strong> de cada etiqueta para quitarla individualmente.
                        </p>
                    </div>
                </div>

                <vs-table max-items="20" stripe search pagination :data="librosFiltrados">
                    <template slot="header">
                        <vs-chip color="primary">Cantidad: <b> {{ librosFiltrados.length }}</b></vs-chip>
                    </template>
                    <template slot="thead">
                        <vs-th width="35%">Nombre</vs-th>
                        <vs-th v-if="doActions == 1">Pdfs</vs-th>
                        <vs-th v-if="doActions == 1">Portada SG</vs-th>
                        <vs-th v-if="doActions == 1">Portada CG</vs-th>
                        <vs-th v-if="doActions">Detalles</vs-th>
                        <vs-th>Estado</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                <p><b>Libro:</b> {{data[indextr].nombrelibro}}</p>
                                <p><b>Nombre Imprimir:</b> {{data[indextr].nombre_imprimir}}</p>
                                <p class="mt-1"><b>Descripción:</b> {{data[indextr].descripcionlibro}}</p>
                                <p class="mt-1"><b>Serie:</b> {{ tr.nombre_serie }}</p>
                                <p class="mt-1"><b>Código:</b> {{ tr.codigo_liquidacion }}</p>
                                <p v-if="tr.folleto_nombre"><b>Folleto:</b> {{ tr.folleto_nombre }}</p>
                                <p v-if="tr.libro_plus_nombre"><b>Libro Plus:</b> {{ tr.libro_plus_nombre }}</p>
                                <b v-if="tr.codigos_combos">Códigos del combo</b>
                                <p v-if="tr.codigos_combos">{{ tr.codigos_combos }}</p>
                                <b v-if="tr.codigos_combos_regalado">Códigos del combo regalado</b>
                                <p v-if="tr.codigos_combos_regalado">{{ tr.codigos_combos_regalado }}</p>
                                <p v-if="tr.id_pro_codigo_padre"><b>Producto padre:</b> {{tr.id_pro_codigo_padre}} - {{ tr.nombre_producto_padre }}</p>
                                <p v-if="tr.nombre_grupo_v3"><b>Grupo para v3: </b>{{ tr.nombre_grupo_v3 }}</p>
                                <p><b>ID Perseo Prolipa 2026: </b><span :class="{ 'text-danger': !tr.id_perseo_prolipa2026_produccion }">{{ tr.id_perseo_prolipa2026_produccion ? tr.id_perseo_prolipa2026_produccion : 'No tiene' }}</span></p>
                                <p><b>ID Perseo Calmed 2026: </b><span :class="{ 'text-danger': !tr.id_perseo_calmed2026_produccion }">{{ tr.id_perseo_calmed2026_produccion ? tr.id_perseo_calmed2026_produccion : 'No tiene' }}</span></p>
                                <vs-chip v-if="data[indextr].serie === '0'">Sin plus</vs-chip>
                                <vs-chip v-else color="success">Plus</vs-chip>
                            </vs-td>
                            <vs-td v-if="doActions == 1">
                                <span class="enlace" :class="{'disabled-link': loadingLibro}" @click="!loadingLibro && datolibro(tr,tr.weblibro)">
                                    <b>Weblibro :</b><span v-if="tr.weblibro"> {{ tr.weblibro}}</span><span class="text-danger" v-else> No disponible</span><br>
                                </span>
                                <span class="enlace" :class="{'disabled-link': loadingLibro}" @click="!loadingLibro && datolibro_guia(tr,tr.weblibro_guia)">
                                    <b>Weblibro con guía:</b><span v-if="tr.weblibro_guia"> {{ tr.weblibro_guia}}</span><span class="text-danger" v-else> No disponible</span><br>
                                </span>
                                <span class="enlace" v-if="tr.folleto_weblibro" :class="{'disabled-link': loadingLibro}" @click="!loadingLibro && datolibro(tr,tr.folleto_weblibro)">
                                    <b>Weblibro con Folleto:</b><span v-if="tr.folleto_weblibro"> {{ tr.folleto_weblibro}}</span><span class="text-danger" v-else> No disponible</span><br>
                                </span>
                                <span class="enlace" @click="datopdfsinguia(tr.pdfsinguia)">
                                    <b>SG :</b><span v-if="tr.pdfsinguia"> {{ tr.pdfsinguia }}</span><span class="text-danger" v-else> No disponible</span><br>
                                </span>
                                <span class="enlace" @click="datopdfconguia(tr.pdfconguia)">
                                    <b>G :</b><span v-if="tr.pdfconguia"> {{ tr.pdfconguia }}</span><span class="text-danger" v-else> No disponible</span><br>
                                </span>
                                <span class="enlace" @click="datopdfguiadidactica(tr.guiadidactica)">
                                    <b>G Didactica:</b><span v-if="tr.guiadidactica"> {{ tr.guiadidactica }}</span><span class="text-danger" v-else> No disponible</span><br>
                                </span>
                            </vs-td>
                            <vs-td v-if="doActions == 1">
                                <a @click="!loadingLibro && datolibro(tr,tr.weblibro)" :class="{'disabled-link': loadingLibro}" style="cursor:pointer;">
                                    <img v-if="data[indextr].weblibro != null " width="50" class="card-img-top" v-bind:src="$data_url+'archivos/upload/libro/'+data[indextr].weblibro+'/'+tr.portada" alt="Card image cap">
                                    <img v-else class="card-img-top" width="50" :src="fileNotFound" alt="No image">
                                </a>
                                <small class="d-block text-center mt-1">Sin Guía</small>
                            </vs-td>
                            <vs-td v-if="doActions == 1">
                                <a @click="!loadingLibro && datolibro_guia(tr,tr.weblibro_guia)" :class="{'disabled-link': loadingLibro}" style="cursor:pointer;">
                                    <img v-if="data[indextr].weblibro_guia != null " width="50" class="card-img-top" v-bind:src="$data_url+'archivos/upload/libro_guia/'+data[indextr].weblibro_guia+'/'+tr.portada" alt="Card image cap">
                                    <img v-else class="card-img-top" width="50" :src="fileNotFound" alt="No image">
                                </a>
                                <small class="d-block text-center mt-1">Con Guía</small>
                            </vs-td>
                            <vs-td v-if="doActions == 1 && tr.folleto_weblibro">
                                <a @click="!loadingLibro && datolibro_guia(tr,tr.folleto_weblibro)" :class="{'disabled-link': loadingLibro}" style="cursor:pointer;">
                                    <img v-if="data[indextr].folleto_weblibro != null " width="50" class="card-img-top" v-bind:src="$data_url+'archivos/upload/libro_guia/'+data[indextr].folleto_weblibro+'/'+tr.portada" alt="Card image cap">
                                    <img v-else class="card-img-top" width="50" :src="fileNotFound" alt="No image">
                                </a>
                                <small class="d-block text-center mt-1">Con Folleto</small>
                            </vs-td>
                            <vs-td v-if="doActions == 1">
                                <vx-tooltip style="display: inline-block;" text="Ver Detalles" position="top" color="warning">
                                    <vs-button size="small" class="modal-default-button" color="primary" @click="verLibroSerie(tr)" type="filled" icon-pack="feather" icon="icon-bookmark"> </vs-button>
                                </vx-tooltip> &nbsp;
                            </vs-td>
                            <vs-td>
                                <template v-if="data[indextr].Estado_idEstado == '1'">
                                    <p>Activado</p>
                                </template>
                                <template v-else>
                                    <p>Desactivado</p>Guía
                                </template>
                            </vs-td>
                            <vs-td>
                                <div v-if="doActions == 1 && (permisoRoot || userAdmin)">
                                    <vx-tooltip style="display: inline-block;" text="Editar libro" position="top" color="success">
                                        <vs-button size="small" class="modal-default-button" color="success" @click="title='Editar';openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                    </vx-tooltip> &nbsp;
                                    <template v-if="data[indextr].Estado_idEstado == '1'">
                                        <vx-tooltip style="display: inline-block;" text="Desactivar libro" position="top" color="danger">
                                            <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirm(data[indextr].idlibro)" type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                        </vx-tooltip> &nbsp;
                                    </template>
                                    <template v-else>
                                        <vx-tooltip style="display: inline-block;" text="Activar libro" position="top" color="warning">
                                            <vs-button size="small" class="modal-default-button" color="primary" @click="openConfirmActivar(data[indextr].idlibro)" type="filled" icon-pack="feather" icon="icon-arrow-up-right"> </vs-button>
                                        </vx-tooltip> &nbsp;
                                    </template>
                                    <vx-tooltip style="display: inline-block;" text="Generar link de libro" position="top" color="dark">
                                        <vs-button size="small" style="display: inline-block;" class="p-2" icon-pack="feather" icon="icon-link" color="dark" @click="idlibro = data[indextr].idlibro; getLinksLibros(); popupLinkLibro=true;"></vs-button>
                                    </vx-tooltip>
                                </div>
                                <div v-else>
                                    <vx-tooltip style="display: inline-block;" v-if="userAdmin || permisoRoot || usuario.id_group == 27" text="Seleccionar libro" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" @click="$emit('changeLibroSelect',tr)" color="primary" type="filled" icon-pack="feather" icon="icon-star"> Seleccionar </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
        <!-- SECCION REGISTRO -->
        <vs-popup class="crear" fullscreen title="Registro nuevo producto" :active.sync="popupGuardar">
            <vs-row>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="11">
                            <font style="font-size: 11.5px">&nbsp;Grupo</font><br>
                            <v-select :options="Grupos" :reduce="Grupos => Grupos.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.gru_pro_codigo" />
                            <span v-if="!tabProducto.gru_pro_codigo" style="color: red; font-size: 11.5px;">Este campo es obligatorio</span>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Datos Producto</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Código del producto " maxlength="10" placeholder="Codigo del Producto" class="w-full" icon-pack="feather" icon="icon-hash" v-model="tabProducto.pro_codigo" @input="convertirAMayusculas()" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.5px">&nbsp;Producto padre</font><br>
                            <v-select :options="arrayTextosSinCombos" :reduce="arrayTextosSinCombos => arrayTextosSinCombos.pro_codigo" label="pro_codigo_nombre" class="w-full h-100" :class="{ 'input-error': errorPadreGuardar }" placeholder="--Seleccione--" v-model="tabProducto.id_pro_codigo_padre" @input="handlePadreGuardar" />
                            <span v-if="errorPadreGuardar" style="color: red; font-size: 11.5px;">Seleccione un producto padre</span>
                            <small class="text-danger">No seleccionar si es un producto padre como manantial lengua 2 (solo si es folleto, cuaderno, guia)</small>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.5px">&nbsp;Grupo para v3</font><br>
                            <v-select :options="GruposV3" :reduce="GruposV3 => GruposV3.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" :class="{ 'input-error': errorGrupoV3Guardar }" placeholder="--Seleccione--" v-model="tabProducto.grupo_codigo_para_v3" @input="handleGrupoV3Guardar" />
                            <span v-if="errorGrupoV3Guardar" style="color: red; font-size: 11.5px;">Seleccione un grupo para v3</span>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.5px">&nbsp;Serie</font><br>
                            <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries.id_serie" label="nombre_serie" placeholder="--Seleccione--" class="w-full" v-model="tabProducto.id_serie" />
                            <span v-if="!tabProducto.id_serie" style="color: red; font-size: 11.5px;">Este campo es obligatorio</span>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Nombre " placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabProducto.pro_nombre" />
                        </vs-col>
                    </vs-row>
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-w="10">
                            <span v-if="!tabProducto.pro_nombre || tabProducto.pro_nombre.trim() === ''" style="color: red; font-size: 11.5px;">Este campo es obligatorio</span>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Descripción " placeholder="Descripción" class="w-full" icon="mode_edit" v-model="tabProducto.pro_descripcion" />
                        </vs-col>
                    </vs-row>
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-w="10">
                            <span v-if="!tabProducto.pro_descripcion || tabProducto.pro_descripcion.trim() === ''" style="color: red; font-size: 11.5px;">Este campo es obligatorio</span>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.5px">&nbsp;IVA *</font><br>
                            <v-select :options="options1" :reduce="options1 => options1.value" label="text" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.pro_iva" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Valor " type="number" placeholder="Valor" class="w-full" icon="mode_edit" v-model="tabProducto.pro_valor" @keypress="validarValor" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.5px; display: inline-flex;">&nbsp;Descuento * &emsp; Formato: 0.00</font><br>
                            <vs-input type="number" id="pro-descuento-input" placeholder="Descuento" class="w-full" icon="mode_edit" v-model="tabProducto.pro_descuento" @keypress="validarDescuento" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Costo " type="number" placeholder="Costo" class="w-full" icon="mode_edit" v-model="tabProducto.pro_costo" @keypress="validarCosto" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Peso " type="number" placeholder="Peso" class="w-full" icon="mode_edit" v-model="tabProducto.pro_peso" @keypress="validarPeso" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px;"><b>Bodega Prolipa</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Stock Facturas" type="number" placeholder="Stock Facturas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_stock" @keypress="validarStock" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Stock Notas" type="number" placeholder="Stock Notas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_deposito" @keypress="validarStock" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px;"><b>Bodega Calmed</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Stock Facturas" type="number" placeholder="Stock Facturas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_stockCalmed" @keypress="validarStock" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Stock Notas" type="number" placeholder="Stock Notas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_depositoCalmed" @keypress="validarStock" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br>
            <vs-row>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Datos libro</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input class="w-full" label="Nombre" icon-pack="feather" icon="icon-book" icon-no-border v-model="tabProducto.nombrelibro" readonly />
                            <span v-if="tabProducto.nombrelibro" style="color: green; font-size: 11.5px;">Este campo esta lleno por los Datos Producto</span>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input class="w-full" label="Nombre imprimir" icon-pack="feather" icon="icon-book" icon-no-border v-model="tabProducto.nombre_imprimir" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Descripción " placeholder="Descripción" class="w-full" icon="mode_edit" v-model="tabProducto.descripcionlibro" readonly />
                            <span v-if="tabProducto.descripcionlibro" style="color: green; font-size: 11.5px;">Este campo esta lleno por los Datos Producto</span>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <vs-input class="w-full" label="Descripción" icon-pack="feather" icon="icon-book" icon-no-border  v-model="tabProducto.descripcionlibro" :readonly="modoEdicion"/>
                    </vs-col>
                </vs-row>
            </vs-col> -->
                <vs-col vs-justify="stard" vs-align="stard" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="9">
                            <font style="font-size: 11.6px">Seleccione la serie:</font><br>
                            <ul class="flex">
                                <li>
                                    <vs-radio v-model="tabProducto.serie" vs-name="radios1serie" vs-value="1">con plus</vs-radio>
                                </li>
                                <li>
                                    <vs-radio v-model="tabProducto.serie" vs-name="radios1serie" vs-value="0" class="ml-2">Sin plus</vs-radio>
                                </li>
                            </ul>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input class="w-full" label="Web libro" icon-pack="feather" icon="icon-link" icon-no-border v-model="tabProducto.weblibro" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input class="w-full" label="Web libro con guia" icon-pack="feather" icon="icon-link" icon-no-border v-model="tabProducto.weblibro_guia" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input class="w-full" label="pdf sin guia" icon-pack="feather" icon="icon-link" icon-no-border v-model="tabProducto.pdfsinguia" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input class="w-full" label="pdf con guia" icon-pack="feather" icon="icon-link" icon-no-border v-model="tabProducto.pdfconguia" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input class="w-full" label="Guia didactica Libro" icon-pack="feather" icon="icon-link" icon-no-border v-model="tabProducto.guiadidactica" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.6px">Asignatura:</font><br>
                            <v-select :options="Asignaturas" :reduce="Asignaturas => Asignaturas" label="nombreasignatura" class="w-full" v-model="tabProducto.asignatura_idasignatura" />
                            <span v-if="!tabProducto.asignatura_idasignatura" style="color: red; font-size: 11.5px;">Este campo es obligatorio</span>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input class="w-full" label="Demo" icon-pack="feather" icon="icon-link" icon-no-border v-model="tabProducto.demo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-row>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="4">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input class="w-full" label="Portada" icon-pack="feather" icon="icon-archive" icon-no-border v-model="tabProducto.portada" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="4">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input class="w-full" label="Portada (SIERRA)" icon-pack="feather" icon="icon-archive" icon-no-border v-model="tabProducto.s_portada" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="4">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input class="w-full" label="Portada (COSTA)" icon-pack="feather" icon="icon-archive" icon-no-border v-model="tabProducto.c_portada" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
                <!--DATOS SERIE-->
                <vs-divider color="warning">Datos serie</vs-divider>
                <vs-row>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.6px">Serie:</font><br>
                                <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries.id_serie" label="nombre_serie" class="w-full" v-model="tabProducto.nombre_serie" readonly disabled />
                                <span v-if="tabProducto.nombre_serie" style="color: green; font-size: 11.5px;">Este campo esta lleno por los Datos Producto</span>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input class="w-full" label="Liquidación" icon-pack="feather" icon="icon-bar-chart" icon-no-border v-model="tabProducto.codigo_liquidacion" readonly disabled />
                                <span v-if="tabProducto.codigo_liquidacion" style="color: green; font-size: 11.5px;">Este campo esta lleno por los Datos Producto</span>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input class="w-full" label="Year" icon-pack="feather" icon="icon-bar-chart" icon-no-border v-model="tabProducto.year" />
                                <span v-if="tabProducto.year" style="color: green; font-size: 11.5px;">Este campo esta lleno por los Datos Producto y es Editable</span>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input class="w-full" label="Versión" icon-pack="feather" icon="icon-bar-chart" icon-no-border v-model="tabProducto.version2" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
                <!--Combo-->
                <vs-divider>Combo</vs-divider>
                <vs-row>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12" class="mb-4">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <ul class="flex">
                                    <li class="mr-3">
                                        <p>¿Es combo?</p>
                                    </li>
                                    <li class="mr-3">
                                        <vs-radio v-model="tabProducto.ifcombo" vs-name="radios1ifcombotab" vs-value="1">Si</vs-radio>
                                    </li>
                                    <li>
                                        <vs-radio v-model="tabProducto.ifcombo" vs-name="radios1ifcombotab" vs-value="0">No</vs-radio>
                                    </li>
                                </ul>
                            </vs-col>
                        </vs-row>
                    </vs-col>

                    <!-- inputs de los códigos si es combo -->
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" v-if="tabProducto.ifcombo == 1">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12" class="mb-2">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <!--input para los codigos combo-->
                                <vs-input class="w-full" label="Códigos combo (Separa por comas cada código sin espacios)" @keydown.space="(event) => event.preventDefault()" icon-pack="feather" icon="icon-book" icon-no-border v-model="tabProducto.codigos_combos" />
                            </vs-col>
                        </vs-row>
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <!--input para los codigos combo regalado-->
                                <vs-input class="w-full" label="Códigos combo regalado (Separa por comas cada código sin espacios)" @keydown.space="(event) => event.preventDefault()" icon-pack="feather" icon="icon-gift" icon-no-border v-model="tabProducto.codigos_combos_regalado" />
                                <div v-if="tabProducto.codigos_combos_regalado && tabProducto.codigos_combos" style="font-size: 11px; margin-top: 4px;">
                                    <span
                                        v-for="cod in tabProducto.codigos_combos_regalado.split(',')"
                                        :key="cod"
                                        :style="{ color: tabProducto.codigos_combos.split(',').includes(cod.trim()) ? 'green' : 'red', marginRight: '6px' }"
                                    >
                                        <span v-if="cod.trim()">{{ cod.trim() }} {{ tabProducto.codigos_combos.split(',').includes(cod.trim()) ? '✔' : '✘ (no está en combos)' }}</span>
                                    </span>
                                </div>
                                <small v-if="validarCodigosRegalados(tabProducto.codigos_combos, tabProducto.codigos_combos_regalado)" style="color: red;">
                                    {{ validarCodigosRegalados(tabProducto.codigos_combos, tabProducto.codigos_combos_regalado) }}
                                </small>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
                <!--Folleto-->
                <vs-divider>Folleto</vs-divider>
                <vs-row>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.6px">Serie para folleto:</font><br>
                                <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries.id_serie" label="nombre_serie" class="w-full" v-model="serieFolletoSelected" @input="f_getFolletoXSerie" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.6px">Folleto:</font><br>
                                <v-select :options="arrayFolletos" :reduce="arrayFolletos => arrayFolletos.idlibro" label="nombrelibro" class="w-full" v-model="tabProducto.id_folleto" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>

                <!--Libro plus -->
                <vs-divider>Libro plus</vs-divider>
                <vs-row>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.6px">Serie para libro plus:</font><br>
                                <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries.id_serie" label="nombre_serie" class="w-full" v-model="serieLibroPlusSelected" @input="f_getLibroPlusXSerie" />
                            </vs-col>
                        </vs-row>
                    </vs-col>

                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.6px">Seleccione el libro plus:</font><br>
                                <v-select :options="arrayLibroPlus" :reduce="arrayLibroPlus => arrayLibroPlus.idlibro" label="libro_pro_codigo" class="w-full" v-model="tabProducto.id_libro_plus" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="guardarnuevo()" class="mr-3 mb-2" type="relief">{{ title }}</vs-button>
                <vs-button @click="popupGuardar = false;" type="relief" color="danger">Cancelar</vs-button>
            </vs-col>
            <br><br><br><br>
        </vs-popup>
        <!--PARA LOS MODALES -->
        <!--MODAL PARA GUARDAR LIBRO-->
        <vs-popup classContent="popup-example" fullscreen :title="title+' Libro'" :active.sync="popupGuardarLibro">
            <!-- <div style="color:#ff0000; text-align:center; font-weight: bold;">PARA MODIFICAR EL NOMBRE, DESCRIPCIÓN y CODIGO LIQUIDACIÓN, INGRESE EN LA SECCIÓN PRODUCTO.</div> -->
            <div class="vx-row">
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <vs-input class="w-full" label="Nombre" icon-pack="feather" icon="icon-book" icon-no-border v-model="libro.nombrelibro" />
                </div>
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <vs-input class="w-full" label="Nombre imprimir" icon-pack="feather" icon="icon-book" icon-no-border v-model="libro.nombre_imprimir" />
                </div>
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <vs-input class="w-full" label="Descripción" icon-pack="feather" icon="icon-book" icon-no-border v-model="libro.descripcionlibro" />
                    <p class="flex justify-start" v-if="!libro.descripcionlibro || libro.descripcionlibro.trim() === ''" style="color: red; font-size: 11.5px;">Este campo es obligatorio</p>
                </div>
                <div class="vx-col sm:w-1/3 w-full mb-2">
                </div>
            </div>
            <div class="vx-row">
                <!--padre-->
                <div class="vx-col w-full mb-2">
                    <font style="font-size: 11.5px">&nbsp;Producto padre</font><br>
                    <v-select :options="arrayTextosSinCombos" :reduce="arrayTextosSinCombos => arrayTextosSinCombos.pro_codigo" label="pro_codigo_nombre" class="w-full h-100" :class="{ 'input-error': errorPadreEditar }" placeholder="--Seleccione--" v-model="libro.id_pro_codigo_padre" @input="handlePadreEditar" />
                    <span v-if="errorPadreEditar" style="color: red; font-size: 11.5px;">Seleccione un producto padre</span>
                    <small class="text-danger">No seleccionar si es un producto padre como manantial lengua 2 (solo si es folleto, cuaderno, guia)</small>
                </div>
                <div class="vx-col w-full mb-2">
                    <font style="font-size: 11.5px">&nbsp;Grupo para v3</font><br>
                    <v-select :options="GruposV3" :reduce="GruposV3 => GruposV3.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" :class="{ 'input-error': errorGrupoV3Editar }" placeholder="--Seleccione--" v-model="libro.grupo_codigo_para_v3" @input="handleGrupoV3Editar" />
                    <span v-if="errorGrupoV3Editar" style="color: red; font-size: 11.5px;">Seleccione un grupo para v3</span>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <p class="mt-2">Seleccione la serie:</p>
                    <ul class="flex mt-2">
                        <li>
                            <vs-radio v-model="libro.serie" vs-name="radios1serie" vs-value="1">con plus</vs-radio>
                        </li>
                        <li>
                            <vs-radio v-model="libro.serie" vs-name="radios1serie" vs-value="0" class="ml-2">Sin plus</vs-radio>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" label="Web libro sin guia" icon-pack="feather" icon="icon-link" icon-no-border v-model="libro.weblibro" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" label="Web libro con guia" icon-pack="feather" icon="icon-link" icon-no-border v-model="libro.weblibro_guia" />
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" label="pdf sin guia" icon-pack="feather" icon="icon-link" icon-no-border v-model="libro.pdfsinguia" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" label="pdf con guia" icon-pack="feather" icon="icon-link" icon-no-border v-model="libro.pdfconguia" />
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" label="Guia didactica Libro" icon-pack="feather" icon="icon-link" icon-no-border v-model="libro.guiadidactica" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-6">
                    <p>Asignatura:</p>
                    <v-select :options="Asignaturas" :reduce="Asignaturas => Asignaturas" label="nombreasignatura" class="w-full" v-model="libro.asignatura_idasignatura" />
                    <span v-if="!libro.asignatura_idasignatura" style="color: red; font-size: 11.5px;">Este campo es obligatorio</span>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-full w-full mb-2">
                    <vs-input class="w-full" label="Demo" icon-pack="feather" icon="icon-link" icon-no-border v-model="libro.demo" />
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <vs-input class="w-full" label="Portada" icon-pack="feather" icon="icon-archive" icon-no-border v-model="libro.portada" />
                </div>
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <vs-input class="w-full" label="Portada (SIERRA)" icon-pack="feather" icon="icon-archive" icon-no-border v-model="libro.s_portada" />
                </div>
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <vs-input class="w-full" label="Portada (COSTA)" icon-pack="feather" icon="icon-archive" icon-no-border v-model="libro.c_portada" />
                </div>
            </div>
            <!--DATOS SERIE-->
            <vs-divider color="warning">Datos serie</vs-divider>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <p>Serie:</p>
                    <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries" label="nombre_serie" class="w-full" v-model="serie.nombre_serie" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-6">
                    <vs-input class="w-full" label="Liquidación" icon-pack="feather" icon="icon-bar-chart" icon-no-border v-model="serie.codigo_liquidacion" :readonly="modoEdicion" />
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" label="Year" icon-pack="feather" icon="icon-bar-chart" icon-no-border v-model="serie.year" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-6">
                    <vs-input class="w-full" label="Versión" icon-pack="feather" icon="icon-bar-chart" icon-no-border v-model="serie.version2" />
                </div>
            </div>
            <!--Combo-->
            <vs-divider>Combo</vs-divider>
            <div class="vx-row">
                <div class="vx-col w-full mb-4">
                    <ul class="flex">
                        <li class="mr-3">
                            <p>¿Es combo?</p>
                        </li>
                        <li class="mr-3">
                            <vs-radio v-model="libro.ifcombo" vs-name="radios1ifcombo" vs-value="1">Si</vs-radio>
                        </li>
                        <li>
                            <vs-radio v-model="libro.ifcombo" vs-name="radios1ifcombo" vs-value="0">No</vs-radio>
                        </li>
                    </ul>
                </div>
                <div class="vx-col w-full" v-if="libro.ifcombo == 1">
                    <div class="vx-row">
                        <div class="vx-col w-full mb-2">
                            <!--input para los codigos combo-->
                            <vs-input class="w-full" label="Códigos combo (Separa por comas cada código sin espacios)" @keydown.space="(event) => event.preventDefault()" icon-pack="feather" icon="icon-book" icon-no-border v-model="libro.codigos_combos" />
                        </div>
                        <div class="vx-col w-full mb-2">
                            <!--input para los codigos combo regalado-->
                            <vs-input class="w-full" label="Códigos combo regalado (Separa por comas cada código sin espacios)" @keydown.space="(event) => event.preventDefault()" icon-pack="feather" icon="icon-gift" icon-no-border v-model="libro.codigos_combos_regalado" />
                            <div v-if="libro.codigos_combos_regalado && libro.codigos_combos" style="font-size: 11px; margin-top: 4px;">
                                <span
                                    v-for="cod in libro.codigos_combos_regalado.split(',')"
                                    :key="cod"
                                    :style="{ color: libro.codigos_combos.split(',').includes(cod.trim()) ? 'green' : 'red', marginRight: '6px' }"
                                >
                                    <span v-if="cod.trim()">{{ cod.trim() }} {{ libro.codigos_combos.split(',').includes(cod.trim()) ? '✔' : '✘ (no está en combos)' }}</span>
                                </span>
                            </div>
                            <small v-if="validarCodigosRegalados(libro.codigos_combos, libro.codigos_combos_regalado)" style="color: red;">
                                {{ validarCodigosRegalados(libro.codigos_combos, libro.codigos_combos_regalado) }}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            <!--Folleto-->
            <vs-divider>Folleto</vs-divider>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <p>Serie para folleto:</p>
                    <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries.id_serie" label="nombre_serie" class="w-full" v-model="serieFolletoSelected" @input="f_getFolletoXSerie" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <p>Folleto:</p>
                    <v-select :options="arrayFolletos" :reduce="arrayFolletos => arrayFolletos.idlibro" label="nombrelibro" class="w-full" v-model="libro.id_folleto" />
                </div>
            </div>
            <!--Libro plus -->
            <vs-divider>Libro plus</vs-divider>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <p>Serie para libro plus:</p>
                    <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries.id_serie" label="nombre_serie" class="w-full" v-model="serieLibroPlusSelected" @input="f_getLibroPlusXSerie" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <p>Seleccione el libro plus:</p>
                    <v-select :options="arrayLibroPlus" :reduce="arrayLibroPlus => arrayLibroPlus.idlibro" label="libro_pro_codigo" class="w-full" v-model="serie.id_libro_plus" />
                </div>
            </div>

            <!--FIN DATOS LIBRO COSTA-->
            <div class="flex justify-center mt-5">
                <vs-button @click="guardarLibro()" class="mb-2">{{ title }}</vs-button>
                <vs-button color="warning" type="border" class="mb-2 ml-5" @click="popupGuardarLibro = false;">Cancelar</vs-button>
            </div>
            <br><br><br><br>
        </vs-popup>
        <!-- Modal para ver la informacion libro serie de cada libro-->
        <vs-popup class="holamundo" title="Libro - serie" :active.sync="popupVerSerie">
            <vs-list>
                <vs-list-header title="Informacion libro - serie del libro"></vs-list-header>
                <vs-list-item title="Libro" :subtitle="lsnombre"></vs-list-item>
                <vs-list-item title="Codigo liquidacion" :subtitle="lscodigo_liquidacion"></vs-list-item>
                <vs-list-item title="Año" :subtitle="lsyear"></vs-list-item>
                <vs-list-item title="Version" :subtitle="lsversion"></vs-list-item>
                <vs-list-item title="Inicial" :subtitle="lsiniciales"></vs-list-item>
                <vs-list-item title="Serie" :subtitle="lsnombre_serie"></vs-list-item>
            </vs-list>
        </vs-popup>
    </vx-card>
    <!-- OVERLAY DE CARGA PARA LIBROS (FUERA DEL VX-CARD) -->
    <div v-if="loadingLibro" class="loading-overlay">
        <div class="loading-content">
            <div class="loading-spinner">
                <i class="vs-icon notranslate icon-scale feather icon-book-open" style="font-size: 48px; animation: pulse 1.5s ease-in-out infinite;"></i>
            </div>
            <h3 class="loading-title">Abriendo su libro digital...</h3>
            <p class="loading-subtitle">Por favor espere un momento</p>
            <div class="loading-bar">
                <div class="loading-bar-fill"></div>
            </div>
        </div>
    </div>
</div>
</template>


<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import fileNotFound from '@/assets/images/file-icons/file-not-found.png'
export default {
    data() {
        return {
            fileNotFound,
            Asignaturas: [],
            libroserieArreglo: [],
            activeConfirm: false,
            popupVerSerie: false,
            id: 0,
            idlibro: 0,
            title: '',
            popupGuardarLibro: false,
            popupGuardar: false,
            unidadesLibro: [],
            arregloSeries: [],
            options1: [{
                    text: '--Seleccione--',
                    value: null
                },
                {
                    text: 'Si',
                    value: true
                },
                {
                    text: 'No',
                    value: false
                },
            ],
            Grupos: [],
            GruposV3: [],
            gru_pro_codigo: 0,
            series: [],
            tabProducto: {
                pro_codigo: '',
                gru_pro_codigo: '',
                grupo_codigo_para_v3: '',
                id_pro_codigo_padre: '',
                pro_nombre: '',
                pro_descripcion: '',
                pro_iva: '',
                pro_valor: '',
                pro_descuento: '',
                pro_stock: '',
                pro_stockCalmed: '',
                pro_deposito: '',
                pro_depositoCalmed: '',
                pro_costo: '',
                pro_peso: '',
                pro_estado: '',
                id_serie: '',
                idlibro: '',
                year: '',
                //INFORMACION LIBRO
                nombrelibro: "",
                nombre_imprimir: "",
                descripcionlibro: "",
                serie: '0',
                weblibro: "",
                weblibro_guia: "",
                pdfsinguia: "",
                pdfconguia: "",
                guiadidactica: "",
                asignatura_idasignatura: "",
                demo: '',
                portada: "portada.png",
                //SIERRA LIBROS
                s_weblibro: "",
                s_pdfsinguia: "",
                s_pdfconguia: "",
                s_guiadidactica: "",
                s_portada: "portada.png",
                //COSTA LIBROS
                c_weblibro: "",
                c_pdfsinguia: "",
                c_pdfconguia: "",
                c_guiadidactica: "",
                c_portada: "portada.png",
                codigo_liquidacion: '',
                nombre_serie: '',
                year: '',
                version2: '',
                ifcombo: 0,
                codigos_combos: '',
                codigos_combos_regalado: '',
                id_folleto: '',
                id_libro_plus: ''
            },
            libro: {
                nombrelibro: "",
                nombre_imprimir: "",
                descripcionlibro: "",
                serie: '0',
                weblibro: "",
                weblibro_guia: "",
                pdfsinguia: "",
                pdfconguia: "",
                guiadidactica: "",
                asignatura_idasignatura: "",
                demo: '',
                ifcombo: 0,
                codigos_combos: '',
                codigos_combos_regalado: '',
                id_folleto: '',
                portada: "portada.png",
                //SIERRA LIBROS
                s_weblibro: "",
                s_pdfsinguia: "",
                s_pdfconguia: "",
                s_guiadidactica: "",
                s_portada: "portada.png",
                //COSTA LIBROS
                c_weblibro: "",
                c_pdfsinguia: "",
                c_pdfconguia: "",
                c_guiadidactica: "",
                c_portada: "portada.png",
                grupo_codigo_para_v3: '',
                id_pro_codigo_padre: ''
            },
            serie: {
                nombrelibro: '',
                nombre_serie: '',
                iniciales: '',
                codigo_liquidacion: '',
                nombre: '',
                year: '',
                version2: '',
                id_libro_plus: ''
            },
            //para mostrar lo de libro serie
            lsnombre: "",
            lscodigo_liquidacion: "",
            lsyear: "",
            lsversion: "",
            lsiniciales: "",
            lsnombre_serie: "",
            popupLinkLibro: false,
            mostrarSeleccionSerie: false,
            link: {
                pag_ini: '',
                pag_fin: '',
                fecha_inicio: '',
                fecha_caducidad: '',
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            links: [],
            permisoRoot: false,
            usuario: [],
            modoEdicion: false,
            numeros: 0,
            userAdmin: false,
            errorGrupoV3Guardar: false,
            errorGrupoV3Editar: false,
            errorPadreGuardar: false,
            errorPadreEditar: false,
            //variables folletos
            serieFolletoSelected: '',
            arrayFolletos: [],
            //fin variables folletos
            //variables libro plus
            serieLibroPlusSelected: '',
            arrayLibroPlus: [],
            //fin variables libro plus
            arrayTextosSinCombos: [],
            loadingLibro: false,
            mostrarCombos: true,
            mostrarSoloConFolletos: false,
            palabrasExcluidas: [],
        }
    },
    components: {
        'v-select': vSelect,
        flatPickr
    },
    props: {
        arreglosLibros: {
            type: Array,
            default: [],
        },
        //0 => no tendra botones; 1 => si
        doActions: {
            type: Number,
            default: 1
        }
    },
    computed: {
        tieneCombos() {
            return this.arreglosLibros.some(libro => libro.ifcombo === 1);
        },
        tieneFolletos() {
            return this.arreglosLibros.some(libro => libro.folleto_weblibro != null && libro.folleto_weblibro !== 'null');
        },
        librosFiltrados() {
            let libros = this.arreglosLibros;

            // Filtrar combos
            if (!this.mostrarCombos) {
                libros = libros.filter(libro => libro.ifcombo !== 1);
            }

            // Filtrar solo libros con folleto
            if (this.mostrarSoloConFolletos) {
                libros = libros.filter(libro => libro.folleto_weblibro != null && libro.folleto_weblibro !== 'null');
            }

            // Excluir registros que contengan las palabras especificadas en palabrasExcluidas
            if (this.palabrasExcluidas && this.palabrasExcluidas.length > 0) {
                libros = libros.filter(libro => {
                    // Función para limpiar de acentos y pasar a minúsculas
                    const normalize = (str) => {
                        return String(str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    };
                    // Ponemos todos los valores juntos para buscar en el objeto completo o en sus campos principales
                    const valuesString = normalize(libro.nombrelibro + ' ' + libro.nombre_serie + ' ' + libro.codigo_liquidacion);

                    // Si incluye ALGUNA de las palabras excluidas, lo sacamos del resultado (return false)
                    // El array palabrasExcluidas tiene las palabras que el usuario escribió en el select
                    const hasExcludedWord = this.palabrasExcluidas.some(word => {
                        return valuesString.includes(normalize(word));
                    });

                    return !hasExcludedWord;
                });
            }

            return libros;
        }
    },
    watch: {
        'tabProducto.pro_nombre': function (newVal, oldVal) {
            this.tabProducto.nombrelibro = newVal;
        },
        'tabProducto.pro_descripcion': function (newVal, oldVal) {
            this.tabProducto.descripcionlibro = newVal;
        },
        'tabProducto.id_serie': function (newVal, oldVal) {
            this.tabProducto.nombre_serie = newVal;
        },
        'tabProducto.pro_codigo': function (newVal, oldVal) {
            const numeros = newVal.replace(/\D/g, '');
            this.tabProducto.year = numeros;
            this.tabProducto.codigo_liquidacion = newVal;
        },

        // Notificación al agregar/quitar palabras excluidas
        palabrasExcluidas(newVal, oldVal) {
            // Solo notificar cuando se AGREGA una palabra nueva (el array creció)
            if (newVal.length > oldVal.length) {
                const nuevaPalabra = newVal[newVal.length - 1];
                const normalize = (str) =>
                    String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const normPalabra = normalize(nuevaPalabra);

                // Contar cuántos libros del arreglo original contienen esa palabra
                const excluidos = this.arreglosLibros.filter(libro => {
                    const campo = normalize(libro.nombrelibro + ' ' + libro.nombre_serie + ' ' + libro.codigo_liquidacion);
                    return campo.includes(normPalabra);
                });

                const total = excluidos.length;
                if (total > 0) {
                    this.$vs.notify({
                        title: `Filtro aplicado: "${nuevaPalabra}"`,
                        text: `Se ${total === 1 ? 'excluyó' : 'excluyeron'} ${total} libro${total === 1 ? '' : 's'} que contienen "${nuevaPalabra}".`,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-filter',
                        position: 'top-right',
                        time: 4000
                    });
                } else {
                    this.$vs.notify({
                        title: `Sin coincidencias: "${nuevaPalabra}"`,
                        text: `Ningún libro contiene "${nuevaPalabra}" — el filtro fue agregado pero no ocultó resultados.`,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-info',
                        position: 'top-right',
                        time: 3500
                    });
                }
            }
        },
    },
    methods: {
        validarCodigosRegalados(combos, regalados) {
            if (!regalados || regalados.trim() === '') return '';
            const regaladosStr = regalados.trim();
            if (regaladosStr.startsWith(',') || regaladosStr.endsWith(',')) {
                return 'Los códigos combo regalado no pueden empezar ni terminar con coma (,)';
            }
            if (!combos || combos.trim() === '') {
                return 'Debe ingresar códigos en el campo de códigos combo primero';
            }
            const combosBase = combos.split(',').map(c => c.trim()).filter(c => c !== '');
            const regaladosArr = regaladosStr.split(',').map(c => c.trim()).filter(c => c !== '');
            const invalidos = regaladosArr.filter(c => !combosBase.includes(c));
            if (invalidos.length > 0) {
                return 'Todos los códigos regalados deben estar en el campo de códigos combo. Inválidos: ' + invalidos.join(', ');
            }
            return '';
        },
        f_getTextosSinCombos() {
            let me = this;
            this.$http.get(this.$server_url + 'GetProductoXGrupo?grupo_codigo=1&sinCombos=1')
                .then(function (res) {
                    me.arrayTextosSinCombos = res.data;
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        validarStock() {
            let stock = this.tabProducto.proStock;
            if (!/^\d+$/.test(stock) || isNaN(stock)) {
                this.tabProducto.proStock = '';
            }
        },
        validarCosto() {
            const costo = this.tabProducto.proCosto;
            if (/^\d/.test(costo)) { // si comienza con un dígito
                if (!/^\d{0,18}(\.\d{1,5})?$/.test(costo)) {
                    this.tabProducto.proCosto = '';
                }
            } else if (/^[,.e]/.test(costo)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(costo)) {
                    this.tabProducto.proCosto = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proCosto = '';
            }
        },
        validarPeso() {
            const peso = this.tabProducto.proPeso;
            if (/^\d/.test(peso)) { // si comienza con un dígito
                if (!/^\d{0,15}(\.\d{1,5})?$/.test(peso)) {
                    this.tabProducto.proPeso = '';
                }
            } else if (/^[,.e]/.test(peso)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(peso)) {
                    this.tabProducto.proPeso = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proPeso = '';
            }
        },
        handleRadioInput(opcion) {
            // Vacía el array Productos cuando se selecciona la opción 'nombres'
            if (opcion === 'nombres') {
                this.Productos = [];
            } else if (opcion === 'codigopro') {
                this.Productos = [];
            }
        },
        validarDescuento() {
            let descuento = this.tabProducto.pro_descuento;
            // Reemplazar comas por puntos solo si hay comas en la cadena
            if (descuento.includes(',')) {
                descuento = descuento.replace(',', '.');
                this.tabProducto.pro_descuento = descuento;
            }
            // Validar el formato del número
            if (!/^\d{0,14}(\.\d{0,2})?$/.test(descuento)) {
                this.tabProducto.pro_descuento = '';
                console.log("reset");
            }
        },
        validarValor() {
            const valor = this.tabProducto.proValor;
            if (/^\d/.test(valor)) { // si comienza con un dígito
                if (!/^\d{0,18}(\.\d{1,5})?$/.test(valor)) {
                    this.tabProducto.proValor = '';
                }
            } else if (/^[,.e]/.test(valor)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(valor)) {
                    this.tabProducto.proValor = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proValor = '';
            }
        },
        getGrupoProducto() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetGrupoProducto_limitado')
                .then(res => {
                    me.$vs.loading.close()
                    this.Grupos = res.data;
                })
                .catch(err => {
                    console.log(err)
                })
        },
        GetGrupoProducto_limitadov3() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetGrupoProducto_limitadov3')
                .then(res => {
                    me.$vs.loading.close()
                    this.GruposV3 = res.data;
                })
                .catch(err => {
                    console.log(err)
                })
        },
        convertirAMayusculas() {
            const numerosString = this.tabProducto.pro_codigo.replace(/\D/g, '');
            this.numeros = numerosString ? parseInt(numerosString) : 0; // Asignar el valor a tabProducto.pro_codigo
            // Extraer los números y almacenarlos en la variable 'numeros'
        },
        validarCampoSerie() {
            // Verifica si tabProducto.gru_pro_codigo es 1, 3 o 6
            if (this.tabProducto.gru_pro_codigo === 1 || this.tabProducto.gru_pro_codigo === 3 || this.tabProducto.gru_pro_codigo === 6) {
                // Verifica si el campo de serie está vacío
                if (!this.tabProducto.id_serie) {
                    // El campo está vacío, devuelve false para indicar que la validación falló
                    return false;
                }
            }
            // Si no se cumple la condición, devuelve true automáticamente sin validar el campo de serie
            return true;
        },
        guardarnuevo() {
            let me = this;
            me.modoEdicion = true;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let numeros = 0;
            if (this.tabProducto.year) {
                numeros = this.tabProducto.year;
            } else {
                numeros = this.tabProducto.pro_codigo.replace(/\D/g, '');
            }
            if (numeros == 0 || numeros == '') {
                this.tabProducto.year = 0
            } else {
                this.tabProducto.year = numeros;
            }
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (me.tabProducto.pro_codigo === '' || me.tabProducto.pro_codigo === null) {
                this.$vs.notify({
                    text: 'Escriba el código del Producto antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (me.tabProducto.gru_pro_codigo === '' || me.tabProducto.gru_pro_codigo === null) {
                this.$vs.notify({
                    text: 'Seleccione el grupo del producto antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabProducto.grupo_codigo_para_v3 == '' || this.tabProducto.grupo_codigo_para_v3 === null) {
                this.errorGrupoV3Guardar = true;
                this.$forceUpdate();
                this.$nextTick(() => {
                    me.$vs.notify({
                        text: 'Ingrese el grupo código para v3 antes de guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                });
                return;
            } else {
                this.errorGrupoV3Guardar = false;
            }
            if (this.tabProducto.grupo_codigo_para_v3 != 1 && this.tabProducto.grupo_codigo_para_v3 != 8) {
                if (this.tabProducto.id_pro_codigo_padre == '' || this.tabProducto.id_pro_codigo_padre === null || this.tabProducto.id_pro_codigo_padre == undefined) {
                    this.errorPadreGuardar = true;
                    this.$forceUpdate();
                    this.$nextTick(() => {
                        me.$vs.notify({
                            text: 'Seleccione el producto padre antes de guardar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    });
                    return;
                } else {
                    this.errorPadreGuardar = false;
                }
            }
            if (!me.tabProducto.pro_nombre || me.tabProducto.pro_nombre.trim() === '') {
                me.$vs.notify({
                    text: 'Debe ingresar el nombre del producto antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.validarCampoSerie()) {
                console.log('El campo de serie está lleno. Puedes continuar con el guardado.');
            } else {
                me.$vs.notify({
                    text: 'El campo de serie está vacío. No puedes continuar con el guardado.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabProducto.asignatura_idasignatura) {
                me.$vs.notify({
                    text: 'Debe seleccionar una asignatura antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabProducto.pro_descripcion || me.tabProducto.pro_descripcion.trim() === '') {
                me.$vs.notify({
                    text: 'Debe ingresar la descripción del producto antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            // Asegurar que nombrelibro esté lleno con el nombre del producto
            if (!me.tabProducto.nombrelibro || me.tabProducto.nombrelibro.trim() === '') {
                me.tabProducto.nombrelibro = me.tabProducto.pro_nombre;
            }

            // Asegurar que descripcionlibro esté lleno con la descripción del producto
            if (!me.tabProducto.descripcionlibro || me.tabProducto.descripcionlibro.trim() === '') {
                me.tabProducto.descripcionlibro = me.tabProducto.pro_descripcion;
            }

            // VALIDAR STOCK Y DEPÓSITO
            let pro_reservar = 0;

            // Verificación y ajuste de pro_deposito
            if (this.tabProducto.pro_deposito === 0 || this.tabProducto.pro_deposito === '') {
                this.tabProducto.pro_deposito = 0;
            } else {
                this.tabProducto.pro_deposito = parseFloat(this.tabProducto.pro_deposito);
            }

            // Verificación y ajuste de pro_depositoCalmed
            if (this.tabProducto.pro_depositoCalmed === 0 || this.tabProducto.pro_depositoCalmed === '') {
                this.tabProducto.pro_depositoCalmed = 0;
            } else {
                this.tabProducto.pro_depositoCalmed = parseFloat(this.tabProducto.pro_depositoCalmed);
            }

            // Verificación y ajuste de pro_stock
            if (this.tabProducto.pro_stock === 0 || this.tabProducto.pro_stock === '') {
                this.tabProducto.pro_stock = 0;
            } else {
                this.tabProducto.pro_stock = parseFloat(this.tabProducto.pro_stock);
            }

            // Verificación y ajuste de pro_stockCalmed
            if (this.tabProducto.pro_stockCalmed === 0 || this.tabProducto.pro_stockCalmed === '') {
                this.tabProducto.pro_stockCalmed = 0;
            } else {
                this.tabProducto.pro_stockCalmed = parseFloat(this.tabProducto.pro_stockCalmed);
            }

            // Calcular pro_reservar como la suma de todas las variables
            pro_reservar = this.tabProducto.pro_stock +
                this.tabProducto.pro_stockCalmed +
                this.tabProducto.pro_deposito +
                this.tabProducto.pro_depositoCalmed;

            // Limpiar códigos combo si no es combo
            if (me.tabProducto.ifcombo == 0) {
                me.tabProducto.codigos_combos = ""
                me.tabProducto.codigos_combos_regalado = ""
            }

            // Validar que codigos_combos no termine ni empiece con coma
            if (me.tabProducto.ifcombo == 1 && me.tabProducto.codigos_combos && me.tabProducto.codigos_combos.trim() !== '') {
                if (me.tabProducto.codigos_combos.trim().endsWith(',') || me.tabProducto.codigos_combos.trim().startsWith(',')) {
                    me.$vs.notify({text: 'Los códigos combo no pueden empezar ni terminar con coma (,)', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle', time: 5000});
                    return;
                }
            }

            // Validar codigos_combos_regalado antes de guardar
            if (me.tabProducto.ifcombo == 1) {
                const errorRegalado = me.validarCodigosRegalados(me.tabProducto.codigos_combos, me.tabProducto.codigos_combos_regalado);
                if (errorRegalado !== '') {
                    me.$vs.notify({
                        text: errorRegalado,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 5000
                    });
                    return;
                }
            }

            let datos = {
                "pro_codigo": me.tabProducto.pro_codigo,
                "gru_pro_codigo": me.tabProducto.gru_pro_codigo,
                "grupo_codigo_para_v3": me.tabProducto.grupo_codigo_para_v3,
                "id_serie": me.tabProducto.id_serie,
                "pro_nombre": me.tabProducto.pro_nombre,
                "pro_descripcion": me.tabProducto.pro_descripcion,
                "pro_iva": me.tabProducto.pro_iva,
                "pro_valor": parseFloat(me.tabProducto.pro_valor),
                "pro_descuento": parseFloat(me.tabProducto.pro_descuento),
                "pro_reservar": parseFloat(pro_reservar),
                "pro_stock": parseFloat(this.tabProducto.pro_stock),
                "pro_deposito": parseFloat(this.tabProducto.pro_deposito),
                "pro_stockCalmed": parseFloat(this.tabProducto.pro_stockCalmed),
                "pro_depositoCalmed": parseFloat(this.tabProducto.pro_depositoCalmed),
                "pro_costo": parseFloat(me.tabProducto.pro_costo),
                "pro_peso": parseFloat(me.tabProducto.pro_peso),
                "nombrelibro": me.tabProducto.nombrelibro,
                "nombre_imprimir": me.tabProducto.nombrelibro,
                "descripcionlibro": me.tabProducto.descripcionlibro,
                "serie": me.tabProducto.serie,
                "weblibro": me.tabProducto.weblibro,
                "weblibro_guia": me.tabProducto.weblibro_guia,
                "pdfsinguia": me.tabProducto.pdfsinguia,
                "pdfconguia": me.tabProducto.pdfconguia,
                "guiadidactica": me.tabProducto.guiadidactica,
                "asignatura_idasignatura": me.tabProducto.asignatura_idasignatura.idasignatura,
                "portada": me.tabProducto.portada,
                "demo": me.tabProducto.demo,
                'ifcombo': me.tabProducto.ifcombo,
                'codigos_combos': me.tabProducto.codigos_combos,
                'codigos_combos_regalado': me.tabProducto.codigos_combos_regalado,
                'id_folleto': me.tabProducto.id_folleto,
                'id_libro_plus': me.tabProducto.id_libro_plus || '',
                "id_serie": me.tabProducto.id_serie,
                "codigo_liquidacion": me.tabProducto.codigo_liquidacion,
                "year": parseInt(me.tabProducto.year),
                "version2": me.tabProducto.version2,
                "s_weblibro": me.tabProducto.s_weblibro,
                "s_pdfsinguia": me.tabProducto.s_pdfsinguia,
                "s_pdfconguia": me.tabProducto.s_pdfconguia,
                "s_guiadidactica": me.tabProducto.s_guiadidactica,
                "s_portada": me.tabProducto.s_portada,
                "c_weblibro": me.tabProducto.c_weblibro,
                "c_pdfsinguia": me.tabProducto.c_pdfsinguia,
                "c_pdfconguia": me.tabProducto.c_pdfconguia,
                "c_guiadidactica": me.tabProducto.c_guiadidactica,
                "c_portada": me.tabProducto.c_portada,
                "user_created": usuarioObjeto.idusuario,
                "id_pro_codigo_padre": this.tabProducto.id_pro_codigo_padre,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + 'Registrar_modificar_producto_libro', datos)
                .then(res => {
                    me.$vs.loading.close()
                    me.popupGuardar = false
                    me.errorGrupoV3Guardar = false
                    me.errorPadreGuardar = false
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Guardado con éxito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    }
                    me.limpiar()
                })
                .catch(function () {
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Error al guardar el producto',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    }
                })
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
        //para obtener el listado de asignaturas
        getAsignaturas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'listaLibro')
                .then(function (res) {
                    me.Asignaturas = res.data.asignatura
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        //lista de series para usar en el select
        listaSeries() {
            let me = this
            this.$http.get(this.$server_url + `libroserie`).then(res => {
                    me.arregloSeries = res.data.serieslista;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        //para ver el libro digital
        async datolibro(data, url) {
            let me = this;
            if (me.loadingLibro) return;

            me.loadingLibro = true;
            let region = localStorage.region
            try {
                const response = await this.$http.get(this.$server_url + 'menu_unidades_libros/' + data.idlibro + '/' + region);
                me.unidadesLibro = response.data;

                localStorage.url = url;
                for (let index = 0; index < me.unidadesLibro.length; index++) {
                    if (index == 0) {
                        localStorage.pag_inicio = me.unidadesLibro[index].pag_inicio
                    }
                    localStorage.pag_fin = me.unidadesLibro[index].pag_fin
                }
                localStorage.vistalibro = 'por_unidad'

                let route = this.$router.resolve({
                    path: '/admin/libro/desgloselibro'
                });
                window.open(route.href, '_blank');

                // Pequeño delay antes de ocultar el overlay para mejor UX
                setTimeout(() => {
                    me.loadingLibro = false;
                }, 500);
            } catch (error) {
                console.error('Error al cargar unidades del libro:', error);
                me.loadingLibro = false;
                me.$vs.notify({
                    text: 'Error al cargar el libro',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
            }
        },
        async datolibro_guia(data, url) {
            let me = this;
            if (me.loadingLibro) return;

            me.loadingLibro = true;
            let region = localStorage.region;

            try {
                const response = await this.$http.get(
                    this.$server_url + 'menu_unidades_libros_guia/' + data.idlibro + '/' + region
                );
                me.unidadesLibro = response.data;
                // Guardar URL
                localStorage.url = url;
                // Buscar menor pag_inicio_guia y mayor pag_fin_guia
                let minInicio = null;
                let maxFin = null;
                for (let i = 0; i < me.unidadesLibro.length; i++) {
                    let u = me.unidadesLibro[i];

                    if (u.pag_inicio_guia != null) {
                        if (minInicio === null || u.pag_inicio_guia < minInicio) {
                            minInicio = u.pag_inicio_guia;
                        }
                    }
                    if (u.pag_fin_guia != null) {
                        if (maxFin === null || u.pag_fin_guia > maxFin) {
                            maxFin = u.pag_fin_guia;
                        }
                    }
                }
                if (minInicio !== null) {
                    localStorage.pag_inicio = minInicio;
                }
                if (maxFin !== null) {
                    localStorage.pag_fin = maxFin;
                }
                localStorage.vistalibro = 'por_unidad_guia';
                // Abrir desglose del libro en nueva pestaña
                let route = this.$router.resolve({
                    path: '/admin/libro/desgloselibro'
                });
                window.open(route.href, '_blank');
                // Pequeño delay antes de ocultar el overlay para mejor UX
                setTimeout(() => {
                    me.loadingLibro = false;
                }, 500);
            } catch (error) {
                console.error('Error al cargar unidades del libro con guía:', error);
                me.loadingLibro = false;
                me.$vs.notify({
                    text: 'Error al cargar el libro con guía',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
            }
        },
        //para ver el libro sin guia en el admin
        datopdfsinguia(url) {
            let me = this
            if (url === null || url === 'null') {
                me.$vs.notify({
                    text: 'El PDF sin guía aun no está disponible',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.pdfsinguia = url;
            let route = this.$router.resolve({
                path: '/admin/libro/pdfsinguia'
            });
            window.open(route.href, '_blank');
        },
        //para ver el libro con guia en el admin
        datopdfconguia(url) {
            let me = this
            if (url === null || url === 'null') {
                me.$vs.notify({
                    text: 'El PDF con guía aun no está disponible',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.url_guia = url;
            let route = this.$router.resolve({
                path: '/docente/libro/pdfconguia'
            });
            window.open(route.href, '_blank');
        },
        datopdfguiadidactica(url) {
            let me = this
            if (url === null || url === 'null') {
                me.$vs.notify({
                    text: 'La guía didáctica aun no está disponible',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.url_guiadid = url;
            let route = this.$router.resolve({
                path: '/docente/libro/pdfguiadidactica'
            });
            window.open(route.href, '_blank');
        },
        //para eliminar el libro
        eliminarLibro() {
            let me = this;
            let formData = new FormData();
            formData.append('idlibro', me.idlibro);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'eliminarLibro', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Libro desactivado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$emit('recharge', true)
                })
        },
        //para activar el libro
        activarLibro() {
            let me = this;
            let formData = new FormData();
            formData.append('idlibro', me.idlibro);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'activarLibro', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Libro Activado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$emit('recharge', true)
                })
        },
        //para abrir el popup de confimacion para eliminar
        openConfirm(idlibro) {
            this.idlibro = idlibro;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmación`,
                text: 'Está seguro de desactivar este libro?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: this.eliminarLibro
            })
        },
        openConfirmActivar(idlibro) {
            this.idlibro = idlibro;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmación`,
                text: 'Está seguro de activar este libro?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: this.activarLibro
            })
        },
        //para guardar las areas
        guardarLibro() {
            let me = this;
            if (me.libro.grupo_codigo_para_v3 == '' || me.libro.grupo_codigo_para_v3 === null) {
                this.errorGrupoV3Editar = true;
                this.$forceUpdate();
                this.$nextTick(() => {
                    me.$vs.notify({
                        text: 'Ingrese el grupo para v3 antes de guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                });
                return;
            } else {
                this.errorGrupoV3Editar = false;
            }
            if (this.libro.grupo_codigo_para_v3 != 1 && this.libro.grupo_codigo_para_v3 != 8) {
                if (this.libro.id_pro_codigo_padre == '' || this.libro.id_pro_codigo_padre === null || this.libro.id_pro_codigo_padre == undefined) {
                    this.errorPadreEditar = true;
                    this.$forceUpdate();
                    this.$nextTick(() => {
                        me.$vs.notify({
                            text: 'Seleccione el producto padre antes de guardar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    });
                    return;
                } else {
                    this.errorPadreEditar = false;
                }
            }
            if (me.libro.nombrelibro === '' || me.libro.serie == '' || me.serie.year == '') {
                this.$vs.notify({
                    text: 'Debe completar todos los campos antes de guardar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (me.libro.nombre_imprimir == "") {
                this.$vs.notify({
                    text: 'Debe ingresar el nombre del libro para imprimir',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (!me.libro.asignatura_idasignatura) {
                this.$vs.notify({
                    text: 'Debe seleccionar una asignatura antes de guardar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (!me.libro.descripcionlibro || me.libro.descripcionlibro.trim() === '') {
                this.$vs.notify({
                    text: 'Debe ingresar la descripción del libro antes de guardar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (me.libro.ifcombo == 0) {
                me.libro.codigos_combos = ""
                me.libro.codigos_combos_regalado = ""
            }
            if (me.libro.codigos_combos === "" || me.libro.codigos_combos) {} else {
                //no se puede pasar mas de 500 caracteres
                if (me.libro.codigos_combos.length > 500) {
                    this.$vs.notify({
                        text: 'No se puede ingresar mas de 500 caracteres en el campo de codigos combos',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                }
            }
            // Validar que codigos_combos no termine ni empiece con coma
            if (me.libro.ifcombo == 1 && me.libro.codigos_combos && me.libro.codigos_combos.trim() !== '') {
                if (me.libro.codigos_combos.trim().endsWith(',') || me.libro.codigos_combos.trim().startsWith(',')) {
                    me.$vs.notify({text: 'Los códigos combo no pueden empezar ni terminar con coma (,)', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle', time: 5000});
                    return;
                }
            }

            // Validar codigos_combos_regalado antes de guardar
            if (me.libro.ifcombo == 1) {
                const errorRegalado = me.validarCodigosRegalados(me.libro.codigos_combos, me.libro.codigos_combos_regalado);
                if (errorRegalado !== '') {
                    me.$vs.notify({
                        text: errorRegalado,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 5000
                    });
                    return;
                }
            }
            let formData = new FormData();
            formData.append('idlibro', me.id);
            formData.append('nombrelibro', me.libro.nombrelibro);
            formData.append('nombre_imprimir', me.libro.nombre_imprimir)
            formData.append('descripcionlibro', me.libro.descripcionlibro);
            formData.append('serie', me.libro.serie);
            formData.append('weblibro', me.libro.weblibro);
            formData.append('weblibro_guia', me.libro.weblibro_guia);
            formData.append('pdfsinguia', me.libro.pdfsinguia);
            formData.append('pdfconguia', me.libro.pdfconguia);
            formData.append('guiadidactica', me.libro.guiadidactica);
            formData.append('asignatura_idasignatura', me.libro.asignatura_idasignatura.idasignatura);
            formData.append('portada', me.libro.portada);
            formData.append('demo', me.libro.demo)
            formData.append('ifcombo', me.libro.ifcombo);
            formData.append('codigos_combos', me.libro.codigos_combos || '');
            formData.append('codigos_combos_regalado', me.libro.codigos_combos_regalado || '');
            formData.append('id_folleto', me.libro.id_folleto);
            //para guardar la serie
            formData.append('id_serie', me.serie.nombre_serie.id_serie);
            formData.append('codigo_liquidacion', me.serie.codigo_liquidacion);
            formData.append('year', me.serie.year);
            formData.append('version2', me.serie.version2);
            formData.append('id_libro_plus', me.serie.id_libro_plus || '');
            //PRODUCTO
            formData.append('grupo_codigo_para_v3', me.libro.grupo_codigo_para_v3);
            formData.append('id_pro_codigo_padre', me.libro.id_pro_codigo_padre || '');
            me.$vs.loading()
            this.$http.post(this.$server_url + 'guardarLibro', formData)
            .then(function (res) {
                me.$vs.loading.close()
                if (res.data.status == 1) {
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.popupGuardarLibro = false
                    me.errorGrupoV3Editar = false
                    me.errorPadreEditar = false
                    if (me.id == 0) {
                        me.$emit('nuevoLibro', me.libro.nombrelibro)
                    } else {
                        me.$emit('recharge', true)
                    }
                    me.limpiar()
                }else{
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 7000
                    })
                }
            })
            .catch(function (error) {
                console.log(error)
                me.$vs.loading.close()
            })
        },
        //para editar los campos
        openModalEditar(data = {}) {
            let me = this;
            me.serieFolletoSelected = '';
            me.serieLibroPlusSelected = '';
            me.arrayFolletos = [];
            me.arrayLibroPlus = [];
            // Resetear errores
            me.errorGrupoV3Editar = false;
            me.errorPadreEditar = false;
            //llenar la data en los campos
            me.id = data.idlibro;
            me.libro.nombrelibro = data.nombrelibro;
            me.libro.nombre_imprimir = data.nombre_imprimir
            me.libro.descripcionlibro = data.descripcionlibro;
            me.libro.serie = data.serie;
            me.libro.weblibro = data.weblibro;
            me.libro.weblibro_guia = data.weblibro_guia;
            me.libro.pdfsinguia = data.pdfsinguia;
            me.libro.pdfconguia = data.pdfconguia;
            me.libro.portada = data.portada;
            if (data.guiadidactica == null || data.guiadidactica == "null" || data.guiadidactica == "0") {
                me.libro.guiadidactica = "";
            } else {
                me.libro.guiadidactica = data.guiadidactica;
            }
            if (data.year == null || data.year == "null" || data.year == "0") {
                me.serie.year = "";
            } else {
                me.serie.year = data.year;
            }
            if (data.version == null || data.version == "null" || data.version == "0") {
                me.serie.version2 = "";
            } else {
                me.serie.version2 = data.version;
            }
            me.libro.asignatura_idasignatura = {
                idasignatura: data.asignatura_idasignatura,
                nombreasignatura: data.asignatura
            };
            //para  editar la tabla serie
            me.serie.nombre_serie = {
                id_serie: data.id_serie,
                nombre_serie: data.nombre_serie
            };
            me.serie.codigo_liquidacion = data.codigo_liquidacion;
            me.serie.id_libro_plus = data.id_libro_plus
            //DATOS LIBRO SIERRA
            me.libro.s_weblibro = data.s_weblibro
            me.libro.s_pdfsinguia = data.s_pdfsinguia
            me.libro.s_pdfconguia = data.s_pdfconguia
            me.libro.s_guiadidactica = data.s_guiadidactica
            me.libro.s_portada = data.s_portada
            me.libro.demo = data.demo
            me.libro.ifcombo = data.ifcombo
            me.libro.id_folleto = data.id_folleto
            //DATOS LIBRO COSTA
            me.libro.c_weblibro = data.c_weblibro
            me.libro.c_pdfsinguia = data.c_pdfsinguia
            me.libro.c_pdfconguia = data.c_pdfconguia
            me.libro.c_guiadidactica = data.c_guiadidactica
            me.libro.c_portada = data.c_portada
            // producto
            me.libro.codigos_combos = data.codigos_combos
            me.libro.codigos_combos_regalado = data.codigos_combos_regalado
            me.libro.grupo_codigo_para_v3 = data.grupo_codigo_para_v3
            me.libro.id_pro_codigo_padre = data.id_pro_codigo_padre || ''
            me.popupGuardarLibro = true;
            me.modoEdicion = true;

            // Cargar folletos si existe folleto_id_serie
            if (data.folleto_id_serie) {
                me.serieFolletoSelected = data.folleto_id_serie;
                me.f_getFolletoXSerie(false); // false = no limpiar folleto en edición
            }
            // Cargar libro plus si existe libro_plus_id_serie
            if (data.libro_plus_id_serie) {
                me.serieLibroPlusSelected = data.libro_plus_id_serie;
                me.f_getLibroPlusXSerie(false); // false = no limpiar libro plus en edición
            }
        },
        //para ver el libro serie especifico
        verLibroSerie(data = {}) {
            let me = this;
            me.popupVerSerie = true
            me.$vs.loading();
            this.$http.get(this.$server_url + 'verLibroSerie?idlibro=' + data.idlibro)
                .then(res => {
                    me.lsiniciales = res.data[0].iniciales;
                    me.lsnombre = res.data[0].nombre
                    me.lscodigo_liquidacion = res.data[0].codigo_liquidacion
                    me.lsyear = res.data[0].year
                    me.lsversion = res.data[0].version
                    me.lsnombre_serie = res.data[0].nombre_serie
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.loading.close();
                })
        },
        //para limpiar los campos
        limpiar() {
            let me = this;
            me.id = 0
            me.libro.nombrelibro = "";
            me.libro.nombre_imprimir = "";
            me.libro.descripcionlibro = "";
            me.libro.weblibro = "";
            me.libro.weblibro_guia = "";
            me.libro.pdfsinguia = "";
            me.libro.pdfconguia = "";
            me.libro.guiadidactica = "";
            me.libro.serie = "0";
            me.libro.asignatura_idasignatura = "";
            me.libro.portada = "portada.png"
            me.libro.demo = ""
            me.libro.ifcombo = 0
            me.libro.codigos_combos = ""
            me.libro.codigos_combos_regalado = ""
            me.libro.grupo_codigo_para_v3 = ""
            me.libro.id_pro_codigo_padre = ""
            me.libro.id_folleto = ""
            //para limpiar la tabla serie
            me.serie.nombre_serie = "";
            me.serie.iniciales = "";
            me.serie.codigo_liquidacion = "";
            me.serie.year = "";
            me.serie.version2 = "";
            me.serie.id_libro_plus = "";
            //DATOS LIBRO SIERRA
            me.libro.s_weblibro = ""
            me.libro.s_pdfsinguia = ""
            me.libro.s_pdfconguia = ""
            me.libro.s_guiadidactica = ""
            me.libro.s_portada = "portada.png"
            //DATOS LIBRO COSTA
            me.libro.c_weblibro = ""
            me.libro.c_pdfsinguia = ""
            me.libro.c_pdfconguia = ""
            me.libro.c_guiadidactica = ""
            me.libro.c_portada = "portada.png"
            me.tabProducto.pro_codigo = ""
            me.tabProducto.gru_pro_codigo = ""
            me.tabProducto.grupo_codigo_para_v3 = ""
            me.tabProducto.id_pro_codigo_padre = ""
            me.tabProducto.pro_costo = null
            me.tabProducto.pro_descripcion = ""
            me.tabProducto.pro_descuento = ""
            me.tabProducto.pro_iva = null
            me.tabProducto.pro_nombre = ""
            me.tabProducto.pro_peso = ""
            me.tabProducto.pro_stock = ""
            me.tabProducto.pro_deposito = ""
            me.tabProducto.pro_stockCalmed = ""
            me.tabProducto.pro_depositoCalmed = ""
            me.tabProducto.pro_valor = ""
            // Resetear errores
            me.errorGrupoV3Guardar = false
            me.errorGrupoV3Editar = false
            me.errorPadreGuardar = false
            me.errorPadreEditar = false
            me.tabProducto.id_serie = ""
            me.tabProducto.nombre_imprimir = "";
            me.tabProducto.descripcionlibro = "";
            me.tabProducto.weblibro = "";
            me.tabProducto.weblibro_guia = "";
            me.tabProducto.pdfsinguia = "";
            me.tabProducto.pdfconguia = "";
            me.tabProducto.guiadidactica = "";
            me.tabProducto.serie = "0";
            me.tabProducto.asignatura_idasignatura = "";
            me.tabProducto.portada = "portada.png"
            me.tabProducto.demo = ""
            me.tabProducto.s_weblibro = ""
            me.tabProducto.s_pdfsinguia = ""
            me.tabProducto.s_pdfconguia = ""
            me.tabProducto.s_guiadidactica = ""
            me.tabProducto.s_portada = "portada.png"
            me.tabProducto.c_weblibro = ""
            me.tabProducto.c_pdfsinguia = ""
            me.tabProducto.c_pdfconguia = ""
            me.tabProducto.c_guiadidactica = ""
            me.tabProducto.c_portada = "portada.png"
            me.tabProducto.version2 = ""
            me.tabProducto.ifcombo = 0
            me.tabProducto.codigos_combos = ""
            me.tabProducto.codigos_combos_regalado = ""
            me.tabProducto.id_folleto = ""
            me.tabProducto.id_libro_plus = ""
            //limpiar folletos
            me.serieFolletoSelected = ""
            me.arrayFolletos = []
            // limpiar libro plus
            me.serieLibroPlusSelected = ""
            me.arrayLibroPlus = []
        },
        getLinksLibros() {
            let me = this
            me.$vs.loading();
            me.$http.get(this.$server_url + 'get_links_libro/' + me.idlibro)
                .then(res => {
                    me.links = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        guardarLink() {
            let me = this
            me.$vs.loading();
            let formData = new FormData();
            formData.append('id_libro', me.idlibro);
            formData.append('pag_ini', me.link.pag_ini);
            formData.append('pag_fin', me.link.pag_fin);
            formData.append('fecha_ini', me.link.fecha_inicio);
            formData.append('fecha_fin', me.link.fecha_caducidad);
            me.$http.post(this.$server_url + 'guardar_link_libro', formData)
                .then(res => {
                    me.getLinksLibros();
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Link guardado con éxito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        copiarLink(item) {
            let me = this
            let host = location.protocol + '//' + location.hostname + ':' + location.port
            let ruta = host + '/libro_free/' + item.pag_ini + '4.3' + item.pag_fin + '4.3' + item.fecha_ini + '4.3' + item.fecha_fin + '4.3' + item.weblibro
            var aux = document.createElement("input");
            console.log('ruta', ruta)
            aux.setAttribute("value", ruta);
            document.body.appendChild(aux);
            aux.select();
            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({
                        text: 'Error al copiar el link',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                } else {
                    me.$vs.notify({
                        text: 'Link copiado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }
            document.body.removeChild(aux);
        },
        handleGrupoV3Guardar(selectedItem) {
            // Resetear el error cuando se selecciona un valor
            if (selectedItem !== null && selectedItem !== '') {
                this.errorGrupoV3Guardar = false;
            }
        },
        handleGrupoV3Editar(selectedItem) {
            // Resetear el error cuando se selecciona un valor
            if (selectedItem !== null && selectedItem !== '') {
                this.errorGrupoV3Editar = false;
            }
        },
        handlePadreGuardar(selectedItem) {
            // Resetear el error cuando se selecciona un valor
            if (selectedItem !== null && selectedItem !== '') {
                this.errorPadreGuardar = false;
            }
        },
        handlePadreEditar(selectedItem) {
            // Resetear el error cuando se selecciona un valor
            if (selectedItem !== null && selectedItem !== '') {
                this.errorPadreEditar = false;
            }
        },
        f_getFolletoXSerie(limpiarFolleto = true) {
            let me = this
            me.$vs.loading();

            // Limpiar selección de folleto al cambiar de serie solo si no es edición
            if (limpiarFolleto) {
                me.tabProducto.id_folleto = '';
                me.libro.id_folleto = '';
            }
            const params = {
                id_serie: me.serieFolletoSelected
            }
            me.$http.get(this.$server_url + 'librosPorSerie', {
                    params
                })
                .then(res => {
                    me.arrayFolletos = res.data.filter(libro =>
                        libro.nombrelibro.toLowerCase().includes('folleto')
                    );

                    // Mostrar mensaje si no se encontraron folletos
                    if (me.arrayFolletos.length === 0) {
                        me.$vs.notify({
                            text: 'No se encontraron folletos para la serie seleccionada',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Error al cargar los folletos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                })
        },
        f_getLibroPlusXSerie(limpiarPlus = true) {
            let me = this
            me.$vs.loading();

            // Limpiar selección de libro plus al cambiar de serie solo si no es edición
            if (limpiarPlus) {
                me.tabProducto.id_libro_plus = '';
                me.serie.id_libro_plus = '';
            }

            const params = {
                id_serie: me.serieLibroPlusSelected
            }
            me.$http.get(this.$server_url + 'librosPorSerie', {
                    params
                })
                .then(res => {
                    me.arrayLibroPlus = res.data.filter(libro =>
                        libro.nombrelibro.toLowerCase().includes('plus')
                    );

                    // Mostrar mensaje si no se encontraron libros plus
                    if (me.arrayLibroPlus.length === 0) {
                        me.$vs.notify({
                            text: 'No se encontraron libros plus para la serie seleccionada',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Error al cargar los libros plus',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                })
        },
        exportarExcel() {
            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['Libro', 'Nombre Imprimir', 'Descripción', 'Serie', 'Código', 'Weblibro', 'Sin Guía', 'Con Guía', 'Guía Didáctica', 'Estado'];
                const filterVal = ['nombrelibro', 'nombre_imprimir', 'descripcionlibro', 'nombre_serie', 'codigo_liquidacion', 'weblibro', 'pdfsinguia', 'pdfconguia', 'guiadidactica', 'estado'];

                const data = this.arreglosLibros.map(libro => {
                    return {
                        nombrelibro: libro.nombrelibro || '',
                        nombre_imprimir: libro.nombre_imprimir || '',
                        descripcionlibro: libro.descripcionlibro || '',
                        nombre_serie: libro.nombre_serie || '',
                        codigo_liquidacion: libro.codigo_liquidacion || '',
                        weblibro: libro.weblibro || 'No disponible',
                        pdfsinguia: libro.pdfsinguia || 'No disponible',
                        pdfconguia: libro.pdfconguia || 'No disponible',
                        guiadidactica: libro.guiadidactica || 'No disponible',
                        estado: libro.Estado_idEstado == '1' ? 'Activado' : 'Desactivado'
                    };
                });

                const list = data.map(v => filterVal.map(j => v[j]));
                const fecha = new Date().toISOString().slice(0, 10);

                excel.export_json_to_excel({
                    header: tHeader,
                    data: list,
                    filename: `Libros_${fecha}`,
                    autoWidth: true,
                    bookType: 'xlsx'
                });

                this.$vs.notify({
                    title: 'Exportación exitosa',
                    text: 'Los datos se han exportado correctamente',
                    color: 'success',
                    icon: 'icon-check'
                });
            }).catch(error => {
                console.error('Error al exportar:', error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se pudo exportar el archivo',
                    color: 'danger',
                    icon: 'icon-alert-triangle'
                });
            });
        },
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.getAsignaturas();
        this.listaSeries();
        localStorage.vistalibro = 'todo'
        this.getUserRoot()
    },
    mounted() {
        let me = this
        if (me.usuario.id_group == 1) {
            me.userAdmin = true
        } else {
            me.userAdmin = false
        }
        me.GetGrupoProducto_limitadov3()
        me.f_getTextosSinCombos()
    },
}
</script>

<style>
.enlace {
    cursor: pointer;
    transition: 1s ease all;
    margin-top: 20px !important;
}

.enlace:hover {
    text-decoration: underline;
    color: #63B8EC;
}

.input-error {
    border: 2px solid red !important;
}

.input-error /deep/ .vs__control {
    border-color: red !important;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.3) !important;
}

.input-error /deep/ .vs__dropdown-toggle {
    border: 2px solid red !important;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.3) !important;
}

/* Loading Overlay Styles */
.loading-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background-color: rgba(0, 0, 0, 0.85) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    z-index: 999999 !important;
    backdrop-filter: blur(5px);
}

.loading-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 50px 60px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    max-width: 500px;
    animation: fadeInScale 0.3s ease-out;
}

.loading-spinner {
    margin-bottom: 25px;
    color: #fff;
}

.loading-title {
    color: #fff;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.loading-subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    margin-bottom: 30px;
}

.loading-bar {
    width: 100%;
    height: 6px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    overflow: hidden;
}

.loading-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0.7), #fff);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 10px;
}

.disabled-link {
    opacity: 0.5;
    cursor: not-allowed !important;
    pointer-events: none;
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* ========================================
   TOOLBAR DE LIBROS
   ======================================== */

.libros-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 6px 0 4px 0;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    margin-bottom: 10px;
}

.libros-toolbar .toolbar-btn {
    margin: 0 !important;
}

/* Fila que contiene el filtro */
.libros-filter-row {
    padding-bottom: 8px;
}

/* ========================================
   FILTRO PALABRAS EXCLUIDAS
   ======================================== */

.palabras-excluidas-wrapper {
    width: 100%;
    max-width: 600px;
    background: rgba(255, 255, 255, 0.03);
    border: 1.5px solid rgba(115, 103, 240, 0.25);
    border-radius: 10px;
    padding: 10px 12px 8px 12px;
    margin-bottom: 8px;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.palabras-excluidas-wrapper:focus-within {
    border-color: rgba(115, 103, 240, 0.6);
    box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.1);
}

/* --- Header row --- */
.palabras-excluidas-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    gap: 8px;
}

.palabras-excluidas-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 600;
    color: #626262;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    user-select: none;
}

.palabras-excluidas-icon {
    font-size: 13px;
    color: #7367f0;
}

/* Badge contador */
.palabras-badge {
    display: inline-flex;
    align-items: center;
    background: linear-gradient(135deg, #7367f0, #9e95f5);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 20px;
    letter-spacing: 0.02em;
    animation: badgePop 0.2s ease;
}

@keyframes badgePop {
    from { transform: scale(0.7); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
}

/* Botón limpiar todo */
.palabras-clear-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: 1px solid rgba(234, 84, 85, 0.4);
    color: #ea5455;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
    white-space: nowrap;
}

.palabras-clear-btn:hover {
    background: #ea5455;
    color: #fff;
    border-color: #ea5455;
    transform: translateY(-1px);
}

.palabras-clear-btn:active {
    transform: translateY(0);
}

.palabras-clear-btn i {
    font-size: 12px;
}

/* Select overrides */
.palabras-excluidas-select .vs__dropdown-toggle {
    border: none !important;
    border-bottom: 1.5px solid rgba(115, 103, 240, 0.3) !important;
    border-radius: 0 !important;
    padding: 0 2px 2px 2px !important;
    background: transparent !important;
    box-shadow: none !important;
    transition: border-color 0.2s;
}

.palabras-excluidas-select .vs__dropdown-toggle:hover {
    border-bottom-color: rgba(115, 103, 240, 0.7) !important;
}

.palabras-excluidas-select .vs__selected {
    background: linear-gradient(135deg, #7367f0, #9e95f5) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 5px !important;
    font-size: 11.5px !important;
    padding: 2px 6px !important;
    margin: 2px 3px !important;
}

.palabras-excluidas-select .vs__deselect svg {
    fill: rgba(255,255,255,0.85) !important;
}

.palabras-excluidas-select .vs__search::placeholder {
    color: #aaa;
    font-size: 12px;
}

.palabras-excluidas-select .vs__search {
    font-size: 12px;
}

/* Hint de ayuda */
.palabras-excluidas-hint {
    margin: 6px 0 0 0;
    font-size: 12.5px;
    color: #888;
    line-height: 1.6;
    display: block;
    background: rgba(115, 103, 240, 0.05);
    border-radius: 5px;
    padding: 5px 8px;
}

.palabras-excluidas-hint i {
    font-size: 12px;
    color: #7367f0;
    display: inline-block;
    vertical-align: middle;
    margin-right: 3px;
}

.palabras-excluidas-hint kbd {
    display: inline-block;
    background: #e8e5ff;
    color: #5e50ee;
    border: 1px solid #c0b8f8;
    border-radius: 3px;
    padding: 0 4px;
    font-size: 10px;
    font-family: monospace;
    line-height: 1.5;
}

</style>
