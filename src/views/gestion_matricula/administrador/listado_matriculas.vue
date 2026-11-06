<template>
    <div>


    <!----modal exportar--------->
    <vs-prompt title="Exportar a Excel" class="export-options" @accept="getEstudiantes(1)" accept-text="Exportar" :active.sync="activePrompt">

        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> las filas que desea exportar.</span>
        </vs-alert>

        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />

    </vs-prompt>
    <!----fin modal exportar--------->

    <!----modal importar--------->
    <vs-popup title="Importar pagos desde excel" :active.sync="modalImportar">

        <importarexcel style="z-index: 4;"/>

    </vs-popup>
    <!----fin modal importar--------->

    <!----modalProcesaMatricula--------->
    <vs-popup title="Importar estudiantes a procesar" :active.sync="modalProcesaMatricula">

        <procesarMatriculas style="z-index: 4;"/>

    </vs-popup>
    <!----fin modalProcesaMatricula--------->


    <!-- modal pagos -->
    <vs-popup title="Ingreso de pago" :active.sync="modalPagos">
        <!-- comprobante_pago: {{comprobante_pago}} -->
        <div class="vx-row mb-3">
            <div class="vx-col sm:w-1/2 w-full mb-3">
                <div style="font-size: 12px; color: gray;">Forma de pago</div>
                <v-select v-model="forma_pago" :options="formas_pago" />
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                <div style="font-size: 12px; color: gray;">Banco/Coop.</div>
                <v-select v-model="banco" :options="bancos" />
            </div>
        </div>


        <div class="vx-row mb-base">
            <div class="vx-col sm:w-1/2 w-full mb-3">
                <vs-input class="w-full" label="Número TR/CH" type="number" v-model="n_tr_ch" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-3">
                <vs-input class="w-full" label="Valor pagado" type="number" v-model="val_pagado" />
            </div>
        </div>

        <div class="w-full" align="center">
            <vs-button type="gradient" class="mb-3" icon-pack="feather" icon="icon-save" @click="guardarPago()">Guardar</vs-button>
        </div>

    </vs-popup>
    <!-- fin modal pagos -->

    <!-- modal cuotas -->
    <vs-popup title="Modificación de cuota" :active.sync="modalCuotas">
        <div class="vx-row mb-base">
            <div class="vx-col sm:w-1/2 w-full mb-3">
                <vs-input class="w-full" label="Valor Cuota" type="number" v-model="val_cuota_edit" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-3">
                <vs-input class="w-full" label="Valor Pendiente" type="number" v-model="val_pend_edit" />
            </div>
        </div>

        <div class="w-full" align="center">
            <vs-button type="gradient" class="mb-3" icon-pack="feather" icon="icon-save" @click="editarCuota()">Editar</vs-button>
        </div>
    </vs-popup>
    <!-- fin modal cuotas -->


    <!-- modal solicitud -->
    <vs-popup title="Validación de pago" :active.sync="modalSolicitud">
        <div align="center">
            <a v-if="comprobante_pago.url" :href="$data_url+comprobante_pago.url.substring(1,comprobante_pago.url.length)" target="_blank">
                <img :src="$data_url+comprobante_pago.url.substring(1,comprobante_pago.url.length)" style="width: 350px; border-radius: 5px;" class="mb-3">
            </a>

            <vs-textarea v-model="comprobante_pago.comentario" />

        </div>

    </vs-popup>
    <!-- fin modal solicitud -->

    <!-- modal beca -->
    <vs-popup title="Aplicación de una beca" :active.sync="modalBeca">


        <vs-collapse>
        <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down">
            <div slot="header"> Aplicar beca a estudiantes seleccionados </div>

            <div class="w-full mb-base" style="color: orange; background-color: #FFF1E3; padding: 8px; border-radius: 5px;">
                <span>Recuerde <b>seleccionar</b> los estudiantes a los que desea aplicar la beca.</span><br>
                <span>La beca <b>no</b> se aplicará para valores pendientes <b>anteriores</b> al periodo actual.</span>
            </div>

            <div class="vx-row mb-base">
                <div class="vx-col mb-4 sm:w-1/2 w-full">
                    <vs-input icon-pack="feather" icon="icon-percent" icon-after vs-icon-after="true" label-placeholder="Porcentaje descuento" class="w-full" type="number" v-model="porcentaje_beca" />
                </div>
                <div class="vx-col mb-4 sm:w-1/2 w-full">
                    <div style="color: gray; font-size: 12px;">Aplicación</div>
                    <!-- {{aplicacion_beca}} -->
                    <v-select :options="formas_beca" :reduce="formas_beca => formas_beca" label="label" class="w-full" v-model="aplicacion_beca" />
                </div>
            </div>

            <div align="center" class="w-full">
                <vs-button @click="aplicarBeca();" color="dark" type="filled" class="mb-2 w-full">Aplicar beca</vs-button>
            </div>

        </vs-collapse-item>

        <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down">
            <div slot="header"> Aplicar becas de un excel </div>

            <importarexcelbeca style="z-index: 4;"/>

        </vs-collapse-item>
        </vs-collapse>

    </vs-popup>
    <!-- fin modal beca -->

    <!-- Modal Configuraciones-->
    <vs-popup fullscreen title="Detalle" :active.sync="modalMatricula">

        <vs-tabs alignment="fixed">
        <vs-tab label="Matricula">
            <div v-if="estudiante.matricula" class="w-full">
                <vs-input disabled class="mb-3 w-full" label="Nombres" type="text" v-model="estudiante.nombres_completos" />

                <div class="vx-row mb-3">
                    <div class="vx-col sm:w-1/2 w-full">
                        <vs-input disabled class="w-full" label="Cédula" type="text" v-model="estudiante.matricula.cedula" />
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <vs-input disabled class="w-full" label="Fecha matrícula" type="text" v-model="estudiante.matricula.fecha_matricula" />
                    </div>
                </div>

                <div class="vx-row mb-3">
                    <div class="vx-col sm:w-1/2 w-full">
                    <!-- {{estudiante.matricula}} -->
                        <div style="font-size: 12px; color: gray;">Nivel</div>
                       
                        <v-select :options="niveles" :reduce="niveles => niveles" label="nombrenivel" class="w-full" v-model="estudiante.matricula.nivel" @input="modificarMatricula()" />
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                    <!-- {{estudiante.matricula.paralelo}} -->
                        <div style="font-size: 12px; color: gray;">Paralelo</div>
                        <v-select :options="paralelos" :reduce="paralelos => paralelos" label="descripcion" class="w-full" v-model="estudiante.matricula.paralelo" @input="modificarMatricula()" />
                    </div>
                </div>

                <vs-input disabled class="mb-6 w-full" label="Observaciones" type="text" v-model="estudiante.matricula.observacion" />

                <div class="vx-row mb-3">
                    <div class="vx-col sm:w-1/2 w-full" align="center">
                        <div style="font-size: 12px; color: gray;">Comprobante de pago</div>
                        <a v-if="estudiante.matricula.url" :href="$data_url+estudiante.matricula.url.substring(1,estudiante.matricula.url.length)" target="_blank">
                            <img :src="$data_url+estudiante.matricula.url.substring(1,estudiante.matricula.url.length)" style="width: 130px; border-radius: 5px;" class="mb-3">
                        </a>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full pt-3" align="center">

                        <vs-button v-if="estado_matricula != 1" @click="estado_matricula = 1; modificarMatricula();" color="primary" type="border" icon-pack="feather" icon="icon-check" class="m-2 w-full" style="font-size: 12px;" size="small">Validar Matrícula</vs-button>

                        <vs-button v-if="estado_matricula != 2" @click="estado_matricula = 2; modificarMatricula();" color="dark" type="border" icon-pack="feather" icon="icon-home" class="m-2 w-full" style="font-size: 12px;" size="small">Cambiar a reservado</vs-button>

                        <vs-button @click="estado_matricula = 3; modificarMatricula();" color="danger" type="border" icon-pack="feather" icon="icon-trash" class="m-2 w-full" style="font-size: 12px;" size="small">Anular matrícula</vs-button>

                    </div>
                </div>
            </div>
        </vs-tab>

        <vs-tab label="Pensión">
            <div v-if="cuotas_matricula">

                <vs-table stripe :data="cuotas_matricula">

                    <template slot="thead">
                        <vs-th>#</vs-th>
                        <vs-th>Fecha</vs-th>
                        <vs-th>Valor</vs-th>
                        <vs-th>Abonado</vs-th>
                        <vs-th>Pendiente</vs-th>
                        <vs-th>Acción</vs-th>
                    </template>

                    <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                        <vs-td v-if="tr.num_cuota == 0">Pendientes</vs-td>
                        <vs-td v-if="tr.num_cuota == 1">Matrícula</vs-td>
                        <vs-td v-if="tr.num_cuota > 1"> Cuota {{tr.num_cuota-1}} </vs-td>
                        <vs-td> {{tr.fecha_a_pagar}} </vs-td>
                        <vs-td> {{tr.valor_cuota}} </vs-td>
                        <vs-td> {{(tr.valor_cuota - tr.valor_pendiente).toFixed(2)}} </vs-td>
                        <vs-td> {{tr.valor_pendiente.toFixed(2)}} </vs-td>

                        <vs-td>
                            <vx-tooltip text="Ver" position="top" color="danger" style="display: inline-block; z-index: 3;">
                                <vs-button v-if="tr.url" size="large" radius icon-pack="feather" icon="icon-info" @click="comprobante_pago='';modalSolicitud=true; comprobante_pago=tr" color="danger" type="line"></vs-button>
                            </vx-tooltip>

                            <vx-tooltip v-if="tr.valor_pendiente > 0" text="Pagar" position="top" color="primary" style="display: inline-block; z-index: 3;">
                                <vs-button size="large" radius icon-pack="feather" icon="icon-dollar-sign" @click="forma_pago='';banco='';n_tr_ch='';val_pagado='';modalPagos=true; comprobante_pago=tr;" color="primary" type="line"></vs-button>
                            </vx-tooltip>

                            <vx-tooltip text="Modificar cuota" position="top" color="warning" style="display: inline-block; z-index: 3;">
                                <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="val_cuota_edit=0;val_pend_edit=0; fillformPago(tr)" color="warning" type="line"></vs-button>
                            </vx-tooltip>
                        </vs-td>

                    </vs-tr>
                    </template>
                </vs-table>

            </div>
        </vs-tab>

         <vs-tab label="Información Estudiante">

            <div>

                <!---INFORMACION DEL ESTUDIANTE-->
                <div>
                    <div slot="header" style="margin-top:20px;">
                        <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Datos del Estudiante</span> </p>
                    </div>

                    <div>
                        <vs-row>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Nombres"   v-model="informacionEstudiantes.nombres" style="width:90%;" placeholder="Nombre"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Apellidos"  v-model="informacionEstudiantes.apellidos" style="width:90%;" placeholder="Apellidos"/>
                            </vs-col>

                                <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Cédula" disabled  v-model="informacionEstudiantes.cedula" style="width:90%;" placeholder="Cédula"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Email"   v-model="informacionEstudiantes.email" style="width:90%;" placeholder="Email"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Institución" disabled v-model="informacionEstudiantes.nombreInstitucion" style="width:90%;" placeholder="Institución"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Curso actual" disabled v-model="informacionEstudiantes.nombrenivel" style="width:90%;" placeholder="Curso actual"/>
                            </vs-col>

                        </vs-row>

                        <br>
                    </div>
                </div>


                <!---INFORMACION DEL Representante Economico-->

                <div>
                    <div slot="header" style="margin-top:20px;">
                    <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Datos del Representante Económico</span> </p>
                    </div>

                    <div>
                        <vs-row>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Parentesco"   v-model="informacionEstudiantes.parentesco_rc" style="width:90%;" placeholder="Parentesco"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Nombres"   v-model="informacionEstudiantes.nombres_rc" style="width:90%;" placeholder="Nombres"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Apellidos"  v-model="informacionEstudiantes.apellidos_rc" style="width:90%;" placeholder="Apellidos"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Cédula"  v-model="informacionEstudiantes.cedula_rc" style="width:90%;" placeholder="Cédula"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input type="number" label="Teléfono casa"  v-model="informacionEstudiantes.telefono_casa_rc" style="width:90%;" placeholder="Teléfono casa"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input type="number" label="Teléfono celular"  v-model="informacionEstudiantes.telefono_celular_rc" style="width:90%;" placeholder="Celular"/>
                            </vs-col>


                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input  label="Dirección"  v-model="informacionEstudiantes.direccion_rc" style="width:90%;" placeholder="Dirección"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Empresa"  v-model="informacionEstudiantes.empresa_rc" style="width:90%;" placeholder="Empresa"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Profesión"  v-model="informacionEstudiantes.profesion_rc" style="width:90%;" placeholder="Profesión"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Dirección trabajo"  v-model="informacionEstudiantes.direccion_trabajo_rc" style="width:90%;" placeholder="Dirección trabajo"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Email"  v-model="informacionEstudiantes.email_rc" style="width:90%;" placeholder="Email"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Sexo"  v-model="informacionEstudiantes.sexo_rc" style="width:90%;" placeholder="Sexo"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Nacionalidad"  v-model="informacionEstudiantes.nacionalidad_rc" style="width:90%;" placeholder="Nacionalidad"/>
                            </vs-col>


                        </vs-row>
                        <br/>


                    </div>
                </div>

                <!---INFORMACION DEL Representante Legal-->

                <div>
                    <div slot="header">
                        <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Datos del Representante legal</span> </p>
                    </div>

                    <div>
                        <vs-row>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Parentesco"   v-model="informacionEstudiantes.parentesco_rl" style="width:90%;" placeholder="Parentesco"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Nombres"   v-model="informacionEstudiantes.nombres_rl" style="width:90%;" placeholder="Nombres"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Apellidos"  v-model="informacionEstudiantes.apellidos_rl" style="width:90%;" placeholder="Apellidos"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Cédula"  v-model="informacionEstudiantes.cedula_rl" style="width:90%;" placeholder="Cédula"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input type="number" label="Teléfono casa"  v-model="informacionEstudiantes.telefono_casa_rl" style="width:90%;" placeholder="Teléfono casa"/>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input type="number" label="Teléfono celular"  v-model="informacionEstudiantes.telefono_celular_rl" style="width:90%;" placeholder="Celular"/>
                            </vs-col>


                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input  label="Dirección"  v-model="informacionEstudiantes.direccion_rl" style="width:90%;" placeholder="Dirección"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Empresa"  v-model="informacionEstudiantes.empresa_rl" style="width:90%;" placeholder="Empresa"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Profesión"  v-model="informacionEstudiantes.profesion_rl" style="width:90%;" placeholder="Profesión"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Dirección trabajo"  v-model="informacionEstudiantes.direccion_trabajo_rl" style="width:90%;" placeholder="Dirección trabajo"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Email"  v-model="informacionEstudiantes.email_rl" style="width:90%;" placeholder="Email"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Sexo"  v-model="informacionEstudiantes.sexo_rl" style="width:90%;" placeholder="Sexo"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Nacionalidad"  v-model="informacionEstudiantes.nacionalidad_rl" style="width:90%;" placeholder="Nacionalidad"/>
                            </vs-col>

                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                <vs-input label="Email Institucional"   v-model="informacionEstudiantes.email_institucional_rl" style="width:90%;" placeholder="Email Institucional"/>
                            </vs-col>
                        </vs-row>
                        <br/>


                    </div>

                </div>

                <vs-row>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <vs-button @click="actualizarData()" id="btnUpdateDatos" type="gradient">Guardar datos</vs-button>

                        <vs-button ref="loadableButton" style="margin-left:20px;" color="success" @click="generarPassword()" type="relief">
                                Resetear contraseña
                        </vs-button>
                    </vs-col>
                </vs-row>


            </div>

        </vs-tab>

        </vs-tabs>



    </vs-popup>
    <!----fin modal configuraciones-->


    <vx-card>

    <vs-tabs alignment="fixed">
    <vs-tab label="Matriculación">
    <!-----listado estudiantes--------->
        <div v-if="estudiantes">
        <vs-table v-model="estudiantes_selected" stripe pagination max-items="10" search :data="estudiantes">
            <template slot="header">
                <!-- <div class="btn-group">
                    <vs-button color="success" type="line" @click="tipo_listado=1; getEstudiantes('no_excel')" class="btn_filtro">Matriculados</vs-button>
                    <vs-button color="primary" type="line" @click="tipo_listado=2; getEstudiantes('no_excel')" class="btn_filtro">Reservados</vs-button>
                    <vs-button color="warning" type="line" @click="tipo_listado='null'; getEstudiantes('no_excel')" class="btn_filtro">Todos</vs-button>
                </div> -->

                <vx-tooltip text="Descargar listado" position="top" color="success">
                    <vs-button radius class="ml-3" color="success" type="border" icon-pack="feather" icon="icon-download" @click="activePrompt = true"></vs-button>
                </vx-tooltip>

                <vx-tooltip v-if="tipo_listado==1 || tipo_listado==2" text="Subir pagos de un excel" position="top" color="primary">
                    <vs-button @click="modalImportar=true" radius class="ml-3" color="primary" type="border" icon-pack="feather" icon="icon-upload"></vs-button>
                </vx-tooltip>

                <vx-tooltip v-if="tipo_listado==1 || tipo_listado==2" text="Aplicar beca o descuento" position="top" color="warning">
                    <vs-button @click="porcentaje_beca=''; modalBeca=true" radius class="ml-3" color="warning" type="border" icon-pack="feather" icon="icon-trending-down"></vs-button>
                </vx-tooltip>

                <vx-tooltip v-if="tipo_listado==1 || tipo_listado==2" text="Procesar matrículas" position="top" color="dark" class="mr-2">
                    <vs-button @click="porcentaje_beca=''; modalProcesaMatricula=true" radius class="ml-3" color="dark" type="border" icon-pack="feather" icon="icon-check"></vs-button>
                </vx-tooltip>

                <vx-tooltip text="Para buscar de clíc fuera del campo de texto." position="top" color="dark" class="mr-2">
                <vs-dropdown class="ml-3" vs-custom-content vs-trigger-click>
                    <a class="flex items-center" href.prevent>
                    <span>Filtros</span>
                    <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4 ml-1" />
                    </a>

                    <vs-dropdown-menu class="dropdown-login" align="center">
                        <vs-divider>Búsqueda individual</vs-divider>
                        <div class="px-4 pb-3">
                            <vs-input type="text" label-placeholder="Por nombres" class="mb-base w-full" v-model="value_filtro1" @blur="filtro_busqueda(value_filtro1, 'nombres')" />
                            <vs-input type="text" label-placeholder="Por apellidos" class="mb-base w-full" v-model="value_filtro2" @blur="filtro_busqueda(value_filtro2, 'apellidos')" />
                            <vs-input type="number" label-placeholder="Por cédula" class="mb-base w-full" v-model="value_filtro3" @blur="filtro_busqueda(value_filtro3, 'cedula')" />
                            <vs-input type="email" label-placeholder="Por email" class="mb-4 w-full" v-model="value_filtro4" @blur="filtro_busqueda(value_filtro4, 'email')" />

                            <vs-divider>Búsqueda general</vs-divider>

                            <vs-button color="success" type="line" @click="tipo_listado=1; getEstudiantes('no_excel')" class="btn_filtro">Matriculados</vs-button>
                            <vs-button color="primary" type="line" @click="tipo_listado=2; getEstudiantes('no_excel')" class="btn_filtro">Reservados</vs-button>
                            <vs-button color="warning" type="line" @click="tipo_listado='null'; getEstudiantes('no_excel')" class="btn_filtro">Todos</vs-button>


                        </div>
                    </vs-dropdown-menu>

                </vs-dropdown>
                </vx-tooltip>

                <v-select :options="periodos" :reduce="periodos => periodos" label="periodoescolar" style="width: 180px;" v-model="periodo_selected" />

            </template>

        <template slot="thead">
                <vs-th>Cédula</vs-th>
                <vs-th>Nombres</vs-th>
                <vs-th>Apellidos</vs-th>
                <!-- <vs-th>Email</vs-th> -->
                <vs-th>Teléfono</vs-th>
                <vs-th>Fecha matrícula</vs-th>
                <vs-th>Estado matrícula</vs-th>
                <vs-th>Estado Pagos</vs-th>
                <vs-th v-if="tipo_listado!='null'">Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                <vs-td> {{tr.matricula.id_matricula}} - {{tr.matricula.cedula}} </vs-td>
                <vs-td> {{tr.matricula.nombres}} </vs-td>
                <vs-td> {{tr.matricula.apellidos}} </vs-td>
                <!-- <vs-td> {{tr.matricula.email}} </vs-td> -->
                <vs-td> {{tr.matricula.telefono}} </vs-td>
                <vs-td> {{tr.matricula.fecha_matricula}} </vs-td>
                <vs-td>
                    <div v-if="tr.matricula.estado_matricula == 2">Reservado</div>
                    <div v-if="tr.matricula.estado_matricula == 1">Matriculado</div>
                    <div v-if="!tr.matricula.estado_matricula">Pendiente</div>
                </vs-td>
                <vs-td>

                    <div v-if="tr.cxc.length > 0">

                        <div hidden :key="index_cxc" v-for="(item_cxc, index_cxc) in tr.cxc" class="mb-base">
                            {{item_cxc.fecha_a_pagar.substr(0,10) +' - '+ fecha_actual+'  comprobante: '+item_cxc.url +' valor pend: '+item_cxc.valor_pendiente}}
                            <div v-if="item_cxc.fecha_a_pagar.substr(0,10) <= fecha_actual && item_cxc.url && item_cxc.valor_pendiente > 0">
                                <div>{{ color_fila[indextr] = 'warning' }}</div>
                                <div>{{ estado_pago[indextr] = 'Mora con solicitud de pago' }}</div>
                            </div>

                            <div v-if="item_cxc.fecha_a_pagar.substr(0,10) <= fecha_actual && !item_cxc.url && item_cxc.valor_pendiente > 0">
                                <div>{{ color_fila[indextr] = 'danger' }}</div>
                                <div>{{ estado_pago[indextr] = 'Mora' }}</div>
                            </div>

                            <div v-if="item_cxc.fecha_a_pagar.substr(0,10) <= fecha_actual && item_cxc.valor_pendiente == 0">
                                <div>{{ color_fila[indextr] = 'dark' }}</div>
                                <div>{{ estado_pago[indextr] = 'Al día - faltan cuotas' }}</div>
                            </div>

                            <div v-if="tr.cxc[tr.cxc.length-1].valor_pendiente == 0">
                                <div>{{ color_fila[indextr] = 'success' }}</div>
                                <div>{{ estado_pago[indextr] = 'Al día' }}</div>
                            </div>

                        </div>

                        <vs-button v-if="estado_pago[indextr]" :color="color_fila[indextr]" type="filled" style="width: 200px; padding: 5px; font-size: 14px;"> {{estado_pago[indextr]}} </vs-button>

                    </div>
                    <div align="center" v-else>No matriculado</div>
                </vs-td>

                <vs-td class="text-center" v-if="tipo_listado!='null'">

                    <vx-tooltip style="display: inline-block;" text="Ver" position="top" color="success">
                        <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="verEstudiante(tr)" color="success" type="line"></vs-button>
                    </vx-tooltip>
                </vs-td>

            </vs-tr>
            </template>
        </vs-table>
        </div>
        <div class="btn-group" v-else>
            <!-- <vs-button color="success" type="line" @click="tipo_listado=1; getEstudiantes('no_excel')" class="btn_filtro">Matriculados</vs-button>
            <vs-button color="primary" type="line" @click="tipo_listado=2; getEstudiantes('no_excel')" class="btn_filtro">Reservados</vs-button>
            <vs-button color="warning" type="line" @click="tipo_listado='null'; getEstudiantes('no_excel')" class="btn_filtro">Todos</vs-button> -->

            <vs-dropdown class="ml-3" vs-custom-content vs-trigger-click>
                <a class="flex items-center" href.prevent>
                <span>Filtros</span>
                <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4 ml-1" />
                </a>

                <vs-dropdown-menu class="dropdown-login">
                    <vs-divider>Búsqueda individual</vs-divider>
                    <div class="px-4 pb-3" align="center">
                        <vs-input type="text" label-placeholder="Por nombres" class="mb-base w-full" v-model="value_filtro1" @blur="filtro_busqueda(value_filtro1, 'nombres')" />
                        <vs-input type="text" label-placeholder="Por apellidos" class="mb-base w-full" v-model="value_filtro2" @blur="filtro_busqueda(value_filtro2, 'apellidos')" />
                        <vs-input type="number" label-placeholder="Por cédula" class="mb-base w-full" v-model="value_filtro3" @blur="filtro_busqueda(value_filtro3, 'cedula')" />
                        <vs-input type="email" label-placeholder="Por email" class="mb-4 w-full" v-model="value_filtro4" @blur="filtro_busqueda(value_filtro4, 'email')" />

                        <vs-divider>Búsqueda general</vs-divider>

                        <vs-button color="success" type="line" @click="tipo_listado=1; getEstudiantes('no_excel')" class="btn_filtro">Matriculados</vs-button>
                        <vs-button color="primary" type="line" @click="tipo_listado=2; getEstudiantes('no_excel')" class="btn_filtro">Reservados</vs-button>
                        <vs-button color="warning" type="line" @click="tipo_listado='null'; getEstudiantes('no_excel')" class="btn_filtro">Todos</vs-button>

                    </div>
                </vs-dropdown-menu>

                <v-select :options="periodos" :reduce="periodos => periodos" label="periodoescolar" style="width: 180px;" v-model="periodo_selected" />

            </vs-dropdown>

        </div>
        <!------fin listado estudiantes--------->
    </vs-tab>

    <vs-tab label="Configuración">
        <niveles/>
    </vs-tab>

    </vs-tabs>
    </vx-card>
       <div>
           <img src="" alt="">
       </div>
    </div>


</template>

<script>
    import axios from 'axios'
    import vSelect from 'vue-select'
    import flatPickr from 'vue-flatpickr-component'
    import 'flatpickr/dist/flatpickr.css'
    import moment from 'moment'
    import niveles from './matricula_niveles.vue'
    import importarexcel from './components/excel_pagos.vue'
    import importarexcelbeca from './components/excel_becas.vue'
    import procesarMatriculas from './components/excel_procesa_matriculas.vue'
    import informacionEstudiante from './components/informacionEstudiante.vue'
    export default {
        data(){
            return {
                color_fila: [],
                usuario: [],
                estudiantes: [],
                estudiante: {},
                modalMatricula: false,
                observaciones: '',
                estado_matricula: 0,
                modalPagos: false,
                modalSolicitud: false,
                niveles: [],
                paralelos:[],
                comprobante_pago: {},
                forma_pago: '',
                formas_pago: ['Efectivo', 'Transferencia', 'Cheque'],
                banco: '',
                bancos: ['Banco Pichincha', 'Banco Guayaquil', 'Produbanco', 'Coop. 29 Octubre'],
                n_tr_ch: '',
                val_pagado: 0,
                tipo_listado: 1,
                fecha_actual: '',
                estado_pago: [],
                activePrompt: false,
                fileName: '',
                estudiantes_selected: [],
                modalImportar: false,
                modalBeca: false,
                porcentaje_beca: '',
                aplicacion_beca: '',
                formas_beca: [
                    {id: 1, label: 'Solo a pensiones'},
                    {id: 2, label: 'Solo a matrícula'},
                    {id: 3, label: 'Matrícula y pensiones'}
                ],
                modalProcesaMatricula: false,
                matricula_admin:'',
                institucionAdmin:'',
                modalCuotas: false,
                val_cuota_edit: 0,
                val_pend_edit: 0,
                cuotas_matricula: [],
                id_matricula_selected: '',
                informacionEstudiantes:[],
                emailuser:'',
                periodos: [],
                periodo_selected: {},
                value_filtro1: '', value_filtro2: '', value_filtro3: '', value_filtro4: '',
            }
        },
        components: {
            'v-select': vSelect,
            flatPickr,
            niveles,
            importarexcel,
            importarexcelbeca,
            procesarMatriculas,
            informacionEstudiante
        },
        created(){
            this.usuario = JSON.parse(localStorage.getItem('usuario'));
            this.matricula_admin = localStorage.getItem("matricula_admin")
            // this.getEstudiantes(2)// 2 carga todo pero no descarga excel
            this.getCombos()
        },
        methods: {
            getPeriodos(){
              let me = this
              this.$http.get(this.$server_url+'periodosXInstitucion/'+me.institucionAdmin)
              .then(res => {
                  me.periodos = res.data
                  me.periodo_selected = me.periodos[0]
              })
            },
            getCombos(){
                let me = this
                if(me.matricula_admin == "yes"){
                    me.institucionAdmin = localStorage.getItem("matricula_institucion")
                }else{
                    me.institucionAdmin = me.usuario.institucion_idInstitucion
                }

                me.getPeriodos()

                this.$http.get(this.$server_url+'combos_matricula/'+me.institucionAdmin)
                .then(res => {
                    me.niveles = res.data.niveles
                    me.paralelos = res.data.paralelos
                })
            },
            getEstudiantes(excel){
                let me = this
                me.$vs.loading()

                let descarga_excel = 'no_excel'
                if( excel == 1 | excel == 2 ){ descarga_excel = 1 }

                if(me.matricula_admin == "yes"){
                    me.institucionAdmin = localStorage.getItem("matricula_institucion")
                }else{
                    me.institucionAdmin = me.usuario.institucion_idInstitucion
                }

                this.$http.get(this.$server_url+'listado_matriculas/'+me.institucionAdmin+'/'+me.periodo_selected.idperiodoescolar+'/'+me.tipo_listado+'/'+descarga_excel)
                .then(res => {

                    let date_actual = new Date()
                    me.fecha_actual = moment(date_actual, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD');
                    me.estudiantes = res.data.items

                    if( excel == 1 ){
                        me.estudiantes_selected = res.data.items
                        me.exportToExcel()
                    }

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            getCuotas(id_matricula){
                let me = this
                me.$vs.loading()

                this.$http.get(this.$server_url+'get_cuotas/'+id_matricula)
                .then(res => {
                    me.cuotas_matricula = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            filtro_busqueda(value_filtro, tipo){
                let me = this
                if( value_filtro == '' ){ return }

                me.$vs.loading()
                this.$http.get(this.$server_url+'busqueda_estudiante_mat/'+me.periodo_selected.idperiodoescolar+'/'+me.institucionAdmin+'/'+tipo+'/'+value_filtro)
                .then(res => {
                    me.estudiantes = res.data.items
                    me.$vs.loading.close()
                    return
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    return
                })

            },
            getDataEstudiante() {
                let me = this;
                me.$vs.loading();

            let cedula = localStorage.getItem("cedulaEstudiante")
            let institucion = localStorage.getItem("institucionEstudiante")

                this.$http.get(this.$server_url+'estudiante/matricula?cedula='+cedula+'&institucion_id='+institucion)
                    .then(function (res) {
                    me.informacionEstudiantes = res.data[0]

                    me.$vs.loading.close()

                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()

                    })
            },
            verEstudiante(item){
                let me = this
                me.getCuotas(item.matricula.id_matricula)
                me.modalMatricula = true
                localStorage.setItem('emailEstudiante',item.matricula.email)
                localStorage.setItem('cedulaEstudiante',item.matricula.cedula)
                localStorage.setItem('institucionEstudiante',item.matricula.institucion_idInstitucion)

                me.getDataEstudiante(item.matricula.cedula,item.matricula.institucion_idInstitucion)

                me.estudiante = item
                me.estado_matricula = item.matricula.estado_matricula

                me.estudiante.matricula.nivel = { "nombrenivel": item.matricula.nombrenivel, "nivel_id": item.matricula.nivel_id}

                me.estudiante.matricula.paralelo = { "paralelo_id": item.matricula.paralelo_id, "descripcion": item.matricula.descripcion}
            },
            modificarMatricula(){
                let me = this
                let formData = new FormData();
                    formData.append('id_matricula', me.estudiante.matricula.id_matricula);
                    formData.append('estado_matricula', me.estado_matricula);
                    formData.append('nivel', me.estudiante.matricula.nivel.nivel_id);
                    formData.append('paralelo', me.estudiante.matricula.paralelo.paralelo_id);
                    formData.append('id_usuario', me.estudiante.matricula.idusuario);
                    formData.append('id_director', me.usuario.idusuario);
                    formData.append('cedulaEstudiante',localStorage.cedulaEstudiante);

                me.$vs.loading()
                this.$http.post(this.$server_url+'matriculas_admin', formData)
                .then(res => {
                    me.modalMatricula = false
                    me.$vs.loading.close()
                    me.getEstudiantes('no_excel')
                    me.$vs.notify({
                    text:'Matricula modificada exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            guardarPago(){
                let me = this

                me.$vs.loading()
                let formData = new FormData();
                    formData.append('forma_pago', me.forma_pago);
                    formData.append('banco', me.banco);
                    formData.append('n_tr_ch', me.n_tr_ch);
                    formData.append('val_pagado', me.val_pagado);
                    formData.append('id_cuotas_id', me.comprobante_pago.id_cuotas_id);
                    formData.append('id_matricula', me.comprobante_pago.id_matricula);
                    formData.append('id_usuario', me.usuario.idusuario);
                this.$http.post(this.$server_url+'guardar_pago_matricula', formData)
                .then(res => {
                    me.$vs.loading.close()
                    if( res.data == 2 ){
                        me.$vs.notify({
                        text:'El valor ingresado excede el total pendiente de todas las cuotas faltantes.',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-alert-triangle'})
                    }else{
                        me.getCuotas(me.id_matricula_selected)
                        me.modalPagos = false
                        me.$vs.notify({
                        text:'Cuota pagada exitosamente',
                        color:'success',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })

            },
            exportToExcel(){
                let me = this

                // let headerTitle = ['Cédula', 'Nombres', 'Apellidos', 'Teléfono','Fecha matriculación', 'Estado matrícula', 'Periodo', 'Valor cuota', 'valor pendiente', 'fecha pago', 'N. cuota', 'Solicitud de pago'];
                let headerTitle = ['Cédula', 'Nombres', 'Apellidos', 'Teléfono','Fecha matriculación', 'Estado matrícula', 'Periodo', 'Nivel', 'Paralelo'];
                // let headerVal = ['cedula', 'nombres', 'apellidos', 'telefono','fecha_matricula', 'estado_matricula', 'descripcion_periodo', 'valor_cuota', 'valor_pendiente', 'fecha_a_pagar', 'num_cuota', 'comentario'];
                let headerVal = ['cedula', 'nombres', 'apellidos', 'telefono','fecha_matricula', 'estado_matricula', 'descripcion_periodo', 'nivel', 'paralelo'];

                let estudiantes_filed = []
                $.each(me.estudiantes_selected,function(key, value){
                    // if(value.cxc.length > 0){
                    //     $.each(value.cxc,function(key_1, value_1){
                    //         estudiantes_filed.push({
                    //             cedula: value.matricula.cedula,
                    //             nombres: value.matricula.nombres,
                    //             apellidos: value.matricula.apellidos,
                    //             telefono: value.matricula.telefono,
                    //             fecha_matricula: value.matricula.fecha_matricula,
                    //             estado_matricula: value.matricula.estado_matricula,
                    //             descripcion_periodo: value.matricula.descripcion_periodo,
                    //             valor_cuota: value_1.valor_cuota,
                    //             valor_pendiente: value_1.valor_pendiente,
                    //             fecha_a_pagar: value_1.fecha_a_pagar,
                    //             num_cuota: value_1.num_cuota,
                    //             comentario: value_1.comentario,
                    //         })
                    //     });
                    // }else{
                    //     estudiantes_filed.push({
                    //         cedula: value.matricula.cedula,
                    //         nombres: value.matricula.nombres,
                    //         apellidos: value.matricula.apellidos,
                    //         telefono: value.matricula.telefono,
                    //         fecha_matricula: value.matricula.fecha_matricula,
                    //         estado_matricula: value.matricula.estado_matricula,
                    //         descripcion_periodo: value.matricula.descripcion_periodo
                    //     })
                    // }

                    estudiantes_filed.push({
                        cedula: value.matricula.cedula,
                        nombres: value.matricula.nombres,
                        apellidos: value.matricula.apellidos,
                        telefono: value.matricula.telefono,
                        fecha_matricula: value.matricula.fecha_matricula,
                        estado_matricula: value.matricula.estado_matricula,
                        descripcion_periodo: value.matricula.descripcion_periodo,
                        nivel: value.matricula.nivel,
                        paralelo: value.matricula.paralelo
                    })

                });

                // console.log('**********+')
                // console.log({estudiantes_filed})
                // console.log('**********+')

                import('@/vendor/Export2Excel').then(excel => {
                    const list = estudiantes_filed
                    const data = this.formatJson(headerVal, list)
                    excel.export_json_to_excel({
                        header: headerTitle,
                        data,
                        filename: this.fileName,
                        autoWidth: true,
                        bookType: 'xlsx'
                    })
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    return v[j]
                }))
            },
            aplicarBeca(){
                let me = this

                let formData = new FormData();
                    formData.append('estudiantes_selected', JSON.stringify(me.estudiantes_selected));
                    formData.append('porcentaje_beca', me.porcentaje_beca);
                    formData.append('aplicacion_beca', me.aplicacion_beca.id);
                    formData.append('id_user_action', me.usuario.idusuario);

                me.$vs.loading()
                this.$http.post(this.$server_url+'aplicar_becas', formData)
                .then(res => {
                    me.modalBeca = false
                    me.$vs.loading.close()
                    me.getEstudiantes('no_excel')
                    me.$vs.notify({
                    text:'Becas aplicadas exitosamente',
                    color:'success', iconPack: 'feather', icon:'icon-check'})
                    me.estudiantes_selected = []
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    me.estudiantes_selected = []
                })

            },
            fillformPago(item){
                let me = this

                me.id_matricula_selected = item.id_matricula
                me.id_cuota_edit = item.id_cuotas_id
                me.val_cuota_edit = item.valor_cuota
                me.val_pend_edit = item.valor_pendiente

                me.modalCuotas = true
            },
            editarCuota(){
                let me = this

                let formData = new FormData();
                    formData.append('id_cuota_edit', me.id_cuota_edit);
                    formData.append('valor_cuota', me.val_cuota_edit);
                    formData.append('valor_pendiente', me.val_pend_edit);
                    formData.append('id_usuario', me.usuario.idusuario);

                me.$vs.loading()
                this.$http.post(this.$server_url+'editar_cuotas', formData)
                .then(res => {
                    me.modalCuotas = false
                    me.$vs.loading.close()
                    me.getCuotas(me.id_matricula_selected)
                    me.$vs.notify({
                    text:'Cuota modificada exitosamente.',
                    color:'success', iconPack: 'feather', icon:'icon-check'})
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })

            },
            actualizarData(){
                let me = this;

                me.informacionEstudiantes.institucion = me.usuario.institucion
                me.informacionEstudiantes.administrador = "yes";

                me.$vs.loading()
                this.$http.post(this.$server_url+'updateEstudianteAdministrador', me.informacionEstudiantes)
                    .then(function (res) {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.getDataEstudiante()
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
            },
            generarPassword() {

                let me = this;
                let formData = new FormData();
                this.$vs.loading({

                })
                me.emailuser = localStorage.getItem("emailEstudiante")
                formData.append('email', me.emailuser);
                this.$http.post(this.$server_url + 'restaurarPassword', formData)
                .then(function (response) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Use el número de cédula para acceder al perfil del usuario.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-lock',
                        time:8000
                    })

                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Error en el proceso',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-lock'
                    })
                    me.$vs.loading.close()
                })
            },

        },

    }
</script>

<style>
.btn_filtro{
    font-size: 12px;
    width: 100px;
    height: 40px;
    padding: 0px !important;
}
</style>
