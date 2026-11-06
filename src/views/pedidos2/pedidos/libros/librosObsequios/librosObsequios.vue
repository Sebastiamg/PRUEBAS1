<template>
<vx-card :title="'Pedido Libros Hijos Docentes# '+pedido.id_pedido" class="mt-3">
    <div v-if="menu == 0">
        <div class="flex">
            <vs-button color="success" v-if="usuario.id_group == 11 || usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true && sendPedido.estado!=2" @click="guardarValorPedidoLibrosObsequios()" icon="save" type="filled">Crear pedido Libros Hijos Docentes/Obsequios </vs-button>
        </div>
        <div v-if="exportTodo">

        </div>
        <vs-table max-items="10" stripe search pagination :data="arregloLibrosObsequios">
            <template slot="header">
                <vs-chip color="primary">Cantidad: {{ arregloLibrosObsequios.length }}</vs-chip>
                <!-- <vs-radio class="ml-2" v-if="usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true " v-model="seleccion"
                                                    vs-value="gerencia" @input="getLibrosObsequios(5);e">Autorizado por Gerencia</vs-radio> -->
                <vs-radio class="ml-2" v-if="usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true " v-model="seleccion" vs-value="gerencia1" @change="getLibrosObsequios(6);">Por Aprobar</vs-radio>
                <vs-radio class="ml-2" v-if="usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true " v-model="seleccion" vs-value="gerencia2" @change="getLibrosObsequios(7);">Aprobados</vs-radio>
                <vs-radio class="ml-2" v-if="usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true " v-model="seleccion" vs-value="gerencia3" @change="getLibrosObsequios(8);">Rechazados</vs-radio>
                <vs-radio class="ml-2" v-if="usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true " v-model="seleccion" vs-value="todos" @change="getLibrosObsequios(0);">Todos</vs-radio>
            </template>
            <template slot="thead">
                <vs-th>Pedido ID#</vs-th>
                <vs-th>Detalle</vs-th>
                <vs-th>Observaciones</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td width="15%">
                        #{{data[indextr].id}}<br>
                        <small>{{ tr.contrato_generado }}</small>
                        <br>
                        <small>{{ tr.nombreInstitucion }}</small>
                    </vs-td>
                    <vs-td width="20%">
                        <small><b>Descuento:</b></small>
                        <p>{{data[indextr].porcentaje_descuento}}%</p>
                        <small><b>Total unidades:</b></small>
                        <p>{{data[indextr].total_unidades}}</p>
                        <br>
                        <small><b>Fecha Creación:</b></small>
                        <p>{{data[indextr].created_at}}</p>
                        <small><b>Usuario Creador:</b></small>
                        <p>{{data[indextr].creador}}</p>
                    </vs-td>
                    <vs-td height="40%" width="40%">
                        <div class="overflow-y-auto h-24">
                            <div v-if="tr.usuario_aprobacion && tr.grupo_aprobador==22 || tr.grupo_aprobador==1 || tr.grupo_aprobador==23 ">
                                <span color="danger"><b>Aprobado por:</b> {{tr.usuario_aprobacion}}</span><br>
                            </div>
                            <div v-if="tr.usuario_aprobacion && tr.grupo_aprobador==25">
                                <span color="danger"><b>Autorizado por:</b> {{tr.usuario_aprobacion}}</span><br>
                            </div>
                            <div v-if="(tr.observacion_asesor && tr.observacion_asesor !== null && tr.observacion_asesor !== 'null')&&(tr.grupo_creador==11)">
                                <b>Asesor:</b> {{ tr.observacion_asesor }}
                            </div>
                            <div v-if="tr.estado_libros_obsequios == 5 || tr.observacion_facturador" class="mt-5">
                                <b>Facturador:</b> {{ tr.observacion_facturador }}
                            </div>
                        </div>
                    </vs-td>
                    <vs-td width="20%">
                        <div v-if="tr.estado_libros_obsequios == 4 && tr.porcentaje_descuento >= 100" class="my-2" style="background-color:#e93c3c;padding:4px;border-radius:5px;">
                            <span style="color:white;">Pendiente aprobación de Facturador Admin</span>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 0">
                            <vs-chip color="primary" transparent>
                                <vs-avatar color="#2478c1" icon-pack="feather" icon="icon-file-plus" />
                                <span>Abierto</span>
                            </vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 4">
                            <vs-chip color="dark" transparent>
                                <vs-avatar icon-pack="feather" icon="icon-user-check" />
                                <span>Aprobado por Gerencia</span>
                            </vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 5">
                            <vs-chip color="success" transparent>
                                <vs-avatar color="#24c1a0" icon-pack="feather" icon="icon-check-circle" />
                                <span>Pedido Aprobado </span>
                            </vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 1">
                            <vs-chip color="danger" transparent>
                                <vs-avatar color="#c12424" icon-pack="feather" icon="icon-minus-square" />
                                <span>Anulado</span>
                            </vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 2">
                            <vs-chip color="danger" transparent>
                                <vs-avatar color="#c12424" icon-pack="feather" icon="icon-slash" />
                                <span>Rechazado</span>
                            </vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 9">
                            <vs-chip color="#d63ec2" transparent>Facturacion completa</vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 6">
                            <vs-chip color="danger" transparent>Aprobado con Pendiente</vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 7">
                            <vs-chip color="rgb(62, 201, 214)" transparent>Preaprobado por Facturador</vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 8 && ( usuario.id_group == 22 ||  usuario.id_group == 23 ||  usuario.id_group == 25 || userRoot == true )">
                            <vs-chip color="dark" transparent>
                                <vs-avatar color="#242121" icon-pack="feather" icon="icon-gift" />
                                <span>Pedido Obsequio</span>
                            </vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 3 && (usuario.id_group == 11)">
                            <vs-chip color="warning" transparent>
                                <vs-avatar color="#c1a424" icon-pack="feather" icon="icon-send" />
                                <span>Enviado</span>
                            </vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 3 && ( usuario.id_group == 22 ||  usuario.id_group == 23 ||  usuario.id_group == 25 || userRoot == true )">
                            <vs-chip color="warning" transparent>
                                <vs-avatar color="#c18f24" icon-pack="feather" icon="icon-bar-chart-2" />
                                <span>Por Aprobar</span>
                            </vs-chip>
                        </div>
                        <div v-if="tr.estado_libros_obsequios == 8 && (usuario.id_group == 11)">
                            <vs-chip color="dark" transparent>
                                <vs-avatar color="#242121" icon-pack="feather" icon="icon-gift" />
                                <span>Enviado como Obsequio</span>
                            </vs-chip>
                        </div>

                    </vs-td>
                    <vs-td width="30%">
                        <!-- Botón con dropdown cuando usarComponenteNuevo está activo -->
                        <div v-if="usarComponenteNuevo || fromListadoVentas">
                        <vs-dropdown vs-custom-content vs-trigger-click>
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <div>


                                    <!-- APROBAR PEDIDO -->
                                    <vs-dropdown-item v-if="[3, 6, 7, 8].includes(tr.estado_libros_obsequios) && (usuario.id_group == 22 || usuario.id_group == 23 || usuario.id_group == 1)">
                                        <vs-button
                                            color="success"
                                            type="relief"
                                            icon-pack="feather"
                                            icon="icon-check"
                                            class="w-full"
                                            @click="librosObsequios=tr; aprobarLibrosObsequiosSoloEstado(tr)">
                                            Aprobar pedido
                                        </vs-button>
                                    </vs-dropdown-item>

                                    <vs-dropdown-item v-if="tr.estado_libros_obsequios == 5 && puedeRevertirAprobacion() && sendPedido.estado != 2">
                                        <vs-button
                                            color="warning"
                                            type="line"
                                            icon-pack="feather"
                                            icon="icon-rotate-ccw"
                                            class="w-full"
                                            @click="librosObsequios=tr; revertirAprobacionLibrosObsequios(tr)">
                                            {{ tr.ifObsequio == 1 ? 'Regresar a obsequio' : 'Quitar aprobado' }}
                                        </vs-button>
                                    </vs-dropdown-item>

                                   <vs-dropdown-item v-if="tr.estado_libros_obsequios == 8 && (( usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true )) && sendPedido.estado != 2">
                                        <!--MOSTRAR /REGISTRAR LIBROS-->
                                        <vs-button color="success" type="line" icon-pack="feather" icon="icon-book" class="w-full" @click="vacilarEmits();pedidoLibrosObsequios.observacion_asesor='';librosObsequios=tr;menu = 3;pedidoLibrosObsequios.observacion_asesor=tr.observacion_asesor">
                                            {{ usuario.id_group == '11' ? 'Registrar': usuario.id_group == '23' || usuario.id_group == '22' || userRoot == true ? 'Modificar': 'Registrar'}} Libros Obsequios</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="(tr.estado_libros_obsequios == 3 || tr.estado_libros_obsequios == 7 ||  tr.estado_libros_obsequios == 8) && (usuario.id_group == 23 ||  usuario.id_group == 25 || userRoot == true ) && sendPedido.estado != 2">
                                        <!--RECHAZAR PEDIDO-->
                                        <vs-button color="warning" type="line" icon-pack="feather" icon="icon-x" @click="librosObsequios=tr;VerificacionRechazoPedido(tr)" class="w-full text-normal p-2">Rechazar pedido Libros Hijos Docentes</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="(tr.estado_libros_obsequios != 5 || tr.estado_libros_obsequios != 6 ) && tr.estado_libros_obsequios == 0 || tr.estado_libros_obsequios == 3  || tr.estado_libros_obsequios == 8 && (usuario.id_group == 11 || userRoot == true ) && sendPedido.estado != 2">
                                        <!--MOSTRAR /REGISTRAR LIBROS-->
                                        <vs-button color="success" type="line" icon-pack="feather" icon="icon-book" class="w-full" @click="vacilarEmits();pedidoLibrosObsequios.observacion_asesor='';librosObsequios=tr;menu = 3;pedidoLibrosObsequios.observacion_asesor=tr.observacion_asesor">
                                            {{ usuario.id_group == '11' ? 'Registrar': usuario.id_group == '23' || usuario.id_group == '22' || userRoot == true ? 'Modificar Pedido': 'Registrar'}} Libros Hijos Docentes</vs-button>
                                    </vs-dropdown-item>

                                    <!--ELIMINAR-->
                                    <vs-dropdown-item v-if="(usuario.id_group == 11 || userRoot == true ) && (tr.estado_libros_obsequios === 0 || tr.estado_libros_obsequios === 2)">
                                        <vs-button
                                            color="danger"
                                            icon-pack="feather"
                                            icon="icon-trash"
                                            type="line"
                                            class="w-full"
                                            @click="librosObsequios=tr;menu = 1">
                                            Eliminar
                                        </vs-button>
                                    </vs-dropdown-item>

                                    <!-- RECHAZAR PEDIDO -->
                                    <vs-dropdown-item v-if="[3, 6, 7].includes(tr.estado_libros_obsequios) && (usuario.id_group == 22 || usuario.id_group == 23 || usuario.id_group == 1)">
                                        <vs-button
                                            color="danger"
                                            type="line"
                                            icon-pack="feather"
                                            icon="icon-x"
                                            class="w-full"
                                            @click="librosObsequios=tr; VerificacionRechazoPedido(tr)">
                                            Rechazar pedido
                                        </vs-button>
                                    </vs-dropdown-item>

                                    <!-- VER DETALLES -->
                                    <vs-dropdown-item>
                                        <vs-button
                                            color="primary"
                                            type="line"
                                            icon-pack="feather"
                                            icon="icon-bookmark"
                                            class="w-full"
                                            @click="librosObsequios=tr; mostrarResumen(tr)">
                                            Ver detalles
                                        </vs-button>
                                    </vs-dropdown-item>
                                </div>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                        </div>

                        <!-- Botonera completa cuando NO viene desde Listado de Ventas -->
                        <div v-else>
                        <vs-dropdown vs-custom-content vs-trigger-click>
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <div>
                                    <vs-dropdown-item v-if="tr.estado_libros_obsequios == 3 && ( usuario.id_group == 22 ) && sendPedido.estado != 2">
                                        <!--ACEPTAR PEDIDO-->
                                        <vs-button class="w-full" color="success" @click="librosObsequios=tr; openConfirmLibrosObsequios(tr); acta.empresa=''; mostrarMensajeVariacion=false; acta.ci='';" icon-pack="feather" icon="icon-check" type="line">Aceptar pedido Libros Obsequios</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="(tr.estado_libros_obsequios == 4 || tr.estado_libros_obsequios == 3 || tr.estado_libros_obsequios == 6 || tr.estado_libros_obsequios == 7 || tr.estado_libros_obsequios == 8) && ( usuario.id_group == 23 || userRoot == true ) && tr.ifObsequio == 0 && sendPedido.estado != 2">
                                        <!--GENERAR ACTA-->
                                        <vs-button class="w-full" color="#910606" @click="DatosAprobar=tr;verificarIniciales(tr);acta.empresa='';mostrarMensajeVariacion=false;acta.ci='';" icon-pack="feather" icon="icon-file-plus" type="line"> {{ tr.estado_libros_obsequios == 6 && tr.ifObsequio == 0 ? 'Aceptar pendiente Libros Hijos Docentes' : tr.estado_libros_obsequios == 6 && tr.ifObsequio == 1 ? 'Aceptar pendiente Libros Obsequios' : tr.estado_libros_obsequios == 8 && tr.ifObsequio == 1 ? 'Aceptar pedido Libros Obsequios' :'Aceptar pedido Libros Hijos Docentes' }}</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="( tr.estado_libros_obsequios == 8 || tr.estado_libros_obsequios == 6) && ( usuario.id_group == 23 || userRoot == true || usuario.id_group == 22 ) && tr.ifObsequio == 1 && sendPedido.estado != 2">
                                        <!--GENERAR ACTA obsequios-->
                                        <vs-button class="w-full" color="#284f28" @click="DatosAprobar=tr; verificarIniciales(tr); acta.empresa=''; mostrarMensajeVariacion=false; acta.ci='';" icon-pack="feather" icon="icon-file-plus" type="line"> {{ tr.estado_libros_obsequios == 6 ? 'Aceptar pendiente Libros Obsequios' : 'Aceptar pedido Libros Obsequios' }}</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="(tr.estado_libros_obsequios == 8) && (usuario.id_group == 23 ||  usuario.id_group == 25 || userRoot == true ) && sendPedido.estado != 2">
                                        <!--RECHAZAR PEDIDO obsequios-->
                                        <vs-button color="#b54414" type="line" icon-pack="feather" icon="icon-x" @click="librosObsequios=tr;VerificacionRechazoPedido(tr)" class="w-full text-normal p-2">Rechazar pedido Libros Obsequios</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="tr.estado_libros_obsequios == 8 && (usuario.id_group == 11 || ( usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true )) && sendPedido.estado != 2">
                                        <!--MOSTRAR /REGISTRAR LIBROS-->
                                        <vs-button color="success" type="line" icon-pack="feather" icon="icon-book" class="w-full" @click="vacilarEmits();pedidoLibrosObsequios.observacion_asesor='';librosObsequios=tr;menu = 3;pedidoLibrosObsequios.observacion_asesor=tr.observacion_asesor">
                                            {{ usuario.id_group == '11' ? 'Registrar': usuario.id_group == '23' || usuario.id_group == '22' || userRoot == true ? 'Modificar': 'Registrar'}} Libros Obsequios</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="(tr.estado_libros_obsequios == 3 || tr.estado_libros_obsequios == 7) && (usuario.id_group == 23 ||  usuario.id_group == 25 || userRoot == true ) && sendPedido.estado != 2">
                                        <!--RECHAZAR PEDIDO-->
                                        <vs-button color="warning" type="line" icon-pack="feather" icon="icon-x" @click="librosObsequios=tr;VerificacionRechazoPedido(tr)" class="w-full text-normal p-2">Rechazar pedido Libros Hijos Docentes</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="(tr.estado_libros_obsequios != 5 || tr.estado_libros_obsequios != 6 ) && tr.estado_libros_obsequios == 0 || tr.estado_libros_obsequios == 3 && (usuario.id_group == 11 || ( usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true )) && sendPedido.estado != 2">
                                        <!--MOSTRAR /REGISTRAR LIBROS-->
                                        <vs-button color="success" type="line" icon-pack="feather" icon="icon-book" class="w-full" @click="vacilarEmits();pedidoLibrosObsequios.observacion_asesor='';librosObsequios=tr;menu = 3;pedidoLibrosObsequios.observacion_asesor=tr.observacion_asesor">
                                            {{ usuario.id_group == '11' ? 'Registrar': usuario.id_group == '23' || usuario.id_group == '22' || userRoot == true ? 'Modificar Pedido': 'Registrar'}} Libros Hijos Docentes</vs-button>
                                    </vs-dropdown-item>

                                    <vs-dropdown-item v-if="tr.estado_libros_obsequios == 5 || tr.estado_libros_obsequios == 6 || tr.estado_libros_obsequios == 1">
                                        <!--REPORTE PDF-->
                                        <vs-button color="dark" type="line" icon-pack="feather" icon="icon-eye" class="w-full" @click="librosObsequios=tr;VerActasLibrosObsequios(tr)">Ver Actas </vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="tr.estado_libros_obsequios == 8">
                                        <!--RESUMEN LIBROS Obsequios-->
                                        <vs-button color="primary" type="line" icon-pack="feather" icon="icon-bookmark" class="w-full" @click="librosObsequios=tr;mostrarResumen(tr)">Resumen Libros Obsequios</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="tr.estado_libros_obsequios !== 8">
                                        <!--RESUMEN LIBROS Hijos Docentes-->
                                        <vs-button color="primary" type="line" icon-pack="feather" icon="icon-bookmark" class="w-full" @click="librosObsequios=tr;mostrarResumen(tr)">Resumen Libros Hijos Docentes</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="(tr.estado_libros_obsequios == 5 || tr.estado_libros_obsequios == 4) && (usuario.id_group == 23|| userRoot == true)">
                                        <!--ANULAR LIBROS-->
                                        <vs-button color="danger" type="line" icon-pack="feather" icon="icon-alert-triangle" class="w-full" @click="librosObsequios=tr;datosAnularLibrosObsequios=[];observacionAnulacion='';abrirAnularLibrosObsequios(tr,1)"><b>Anular pedido Libros Obsequios</b></vs-button>
                                    </vs-dropdown-item>

                                    <!-- <vs-dropdown-item v-if="tr.estado_libros_obsequios == 0">
                                                                        <vs-button color="warning" type="line" icon-pack="feather" icon="send"
                                                                            class="w-full" @click="librosObsequios=tr;menu = 4">Mandar Pedido Libros
                                                                            Obsequios</vs-button>
                                                                    </vs-dropdown-item> -->

                                    <vs-dropdown-item v-if="tr.estado_libros_obsequios === 0 || tr.estado_libros_obsequios === 2">
                                        <!--ELIMINAR-->
                                        <vs-button color="danger" icon-pack="feather" icon="icon-trash" type="line" class="w-full" @click="librosObsequios=tr;menu = 1" v-if="(usuario.id_group == 11 || userRoot == true ) && (tr.estado_libros_obsequios === 0 || tr.estado_libros_obsequios === 2)">Eliminar</vs-button>
                                    </vs-dropdown-item>
                                    <!--MODIFICAR PEDIDO Y ACTA-->
                                    <!-- <vs-dropdown-item v-if="tr.estado_libros_obsequios == 5">
                                                                <vs-button color="danger" icon-pack="feather" icon="icon-edit" type="line" class="w-full" @click="librosObsequios=tr;abrirModificacionPedidoActa(tr);" v-if="(userRoot == true ) && (tr.estado_libros_obsequios == 5)">Cambio detalles acta/pedido</vs-button>
                                                            </vs-dropdown-item> -->
                                </div>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <div v-if="menu == 1">
        <p class="text-danger font-bold text-center">Estas seguro de querer eliminar el pedido Libros Hijos Docentes?</p>
        <div class="flex justify-center">
            <p class="mt-1"></p>
            <vs-button color="danger" @click="eliminarLibrosObsequios()" type="border" icon="delete">Si deseo,
                eliminar</vs-button>
            <vs-button color="primary" @click="menu = 0;getLibrosObsequios(0)" class="ml-3" type="filled" icon="close">Salir, Sin Enviar</vs-button>
        </div>
    </div>
    <!--RESUMEN LIBROS-->
    <div v-if="menu == 2">
        <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
        <resumenLibrosObsequiosVue :librosObsequios="librosObsequios" />
    </div>
    <!--REGISTRAR LIBROS-->
    <div v-if="menu == 3">
        <vs-button v-if="itemsDelPedido==0" color="primary" type="border" @click="menu = 0;getLibrosObsequios(0)">← Regresar</vs-button>
        <screenPedidoLibrosObsequiosVue @enviar_cantidad="recibirCantidad" :librosObsequios="librosObsequios" class="mt-2" :sendPedido="sendPedido" :userRoot="Boolean(userRoot)" ref="screenPedidoLibrosObsequios" />
        <br><br>
        <!-- <div v-if="mostrarMensajeEnviado"> -->
        <div v-if="(mostrarMensajeEnviado && itemsDelPedido > 0) || librosObsequios.estado_libros_obsequios == 3">
            <vs-alert class="mb-3" color="danger" icon="new_releases">
                <span v-if="( usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true )" class="font-bold ">Para guardar la información, no olvides verificar que la información sea precisa.</span>
                <span v-else class="font-bold ">Para enviar la información, no olvides verificar que la información sea precisa. La observación es opcional.</span>
            </vs-alert>
            <!-- <p class="text-danger font-bold text-center">Para enviar la información, no olvides verificar que la información sea precisa.</p><br> -->
            <div v-if="usuario.id_group == 11 || userRoot == true" class="flex justify-center">
                <vs-textarea label="Observación del Pedido Libros Hijos Docentes (Opcional):" placeholder="Escribe tu observación antes de enviar o actualizar tu pedido (opcional)." class="w-full" v-model="pedidoLibrosObsequios.observacion_asesor" />
            </div>
            <div class="flex justify-center">
                <p class="mt-1"></p>
                <vs-button color="success" @click="CambiarEstadoLibrosObsequios(librosObsequios,3)" icon="send">
                    <span v-if="estadoPedidoLibrosHijosDocentes === 3 || librosObsequios.estado_libros_obsequios == 3">Actualizar envío a Facturación</span>
                    <span v-else-if="( usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true )">Guardar y Enviar</span>
                    <span v-else>Enviar a Facturación</span>
                </vs-button>
                <vs-button color="primary" @click="menu = 0;getLibrosObsequios(0)" class="ml-3" type="filled" icon="close">
                    <span v-if="( usuario.id_group == 22 ||  usuario.id_group == 23 || userRoot == true )">Salir sin Guardar</span>
                    <span v-else>Salir, Sin Enviar</span>
                </vs-button>
            </div>
        </div>
    </div>
    <!-- <div v-if="menu == 4">
                                        <p class="text-danger font-bold text-center">¿Estás seguro de querer proceder con el envío de los libros
                                            como obsequios N°{{librosObsequios.id}}?</p><br>
                                        <p class="text-danger font-bold text-center">No olvides verificar que la información sea precisa antes de
                                            enviarla.</p><br>
                                        <div class="flex justify-center">
                                            <vs-textarea label="Observación del Pedido Libros Obsequios:"
                                                placeholder="Escribe tu observación antes de enviar." class="w-full"
                                                v-model="pedidoLibrosObsequios.observacion_asesor" />
                                        </div>
                                        <div class="flex justify-center">
                                            <p class="mt-1"></p>
                                            <vs-button color="success" @click="CambiarEstadoLibrosObsequios(librosObsequios,3)" icon="send">Enviar a Aprobación</vs-button>
                                            <vs-button color="primary" @click="menu = 0;getLibrosObsequios(0)" class="ml-3" type="filled"
                                                icon="close">Cancelar</vs-button>
                                        </div>
                                    </div> -->
    <!--DETAllE LIBROS-->
    <div v-if="menu == 5">
        <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
        <detalleAprobadorLibrosObsequios :librosObsequios="librosObsequios" />
    </div>
    <div v-if="menu == 6">
        <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
        <actasLibrosObsequios :librosObsequios="librosObsequios" />
    </div>
    <!--REPORTE-->
    <div v-if="popupReportePedidoLibroObsequio">
        <exportLibrosObsequiosVueVue style="display:none;" :tipoFile="tipoFile" :librosObsequios="librosObsequios" @change="changeHandle" />
    </div>
    <div v-if="popupDetallePedidoLibroObsequio">
        <exportDetalleLibrosObsequios style="display:none;" :porcentaje_detalle="porcentaje_detalle" :observacion_detalle="observacion_detalle" :tipoFile="tipoFile" :librosObsequios="librosObsequios" @change="changeHandle" />
    </div>
    <!--MODALES-->
    <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
        <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras
                se descarga el archivo</b></p>
        <img class="mt-2" style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" />
    </vs-popup>
    <!--DATOS DETALLE-->
    <vs-popup class="holamundo" title="Observacion Detalle" :active.sync="popupDatosDetalle">
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <vs-textarea label="Observación:" placeholder="Escribe..." class="w-full" v-model="observacion_detalle" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br>
        <vs-row>
            <vs-button @click="guardarDatosDetalle();" type="relief" color="success">Guardar</vs-button>&emsp;
        </vs-row>
    </vs-popup>
    <!-- GENERAR ACTA -->
    <vs-popup class="informacionformhijo" fullscreen :title="acta.estado_libros_obsequios !== 8 ? `Aprobación del Pedido Libros Hijos Docentes n° ${acta.id_pedido_librosObsequios}`: `Aprobación del Pedido Libros Obsequios n° ${acta.id_pedido_librosObsequios}`" :active.sync="popupActa">
        <vs-row>
            <!-- {{acta}} -->
            <vs-row>
                <vs-col v-if="acta.empresa" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b style="font-size: 15px">Acta n° {{ acta.codigoPedidoLibrosActa }}</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.5px">&nbsp;Empresa:</font><br>
                            <v-select :options="listaEmpresas" :reduce="listaEmpresas => listaEmpresas.id" label="nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="acta.empresa" @input="acta.codigoPedidoLibrosActa= '';getCodigoActa(acta.empresa);getLibrosActa(DatosAprobar.id);reset_Switchs()" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row v-if="acta.empresa">
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Institución Beneficiada:" class="w-full" v-model="acta.institucion" readonly />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Responsable:" class="w-full" v-model="acta.responsable" readonly />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Dirección:" class="w-full" v-model="acta.direccion" readonly />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Teléfono:" class="w-full" v-model="acta.telefono" readonly />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-divider> Cliente</vs-divider>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                    <span class="flex justify-center items-center">
                        <b>Facturar a Cliente no beneficiario: </b>
                        <vs-switch class="m-5" v-model="OtherClient" @input="limpiarCliente" />
                    </span>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" v-if="!OtherClient">
                            <font style="font-size: 11.5px">&nbsp;Cliente:</font><br>
                            <v-select :options="arregloBeneficiario" :reduce="arregloBeneficiario => arregloBeneficiario.id_usuario" label="fullLabel" class="w-full h-100" placeholder="--Seleccione--" v-model="acta.beneficiario" @input="mostrarMensajeVariacion=false;ponerCedulaCliente();evaluarCedulaCliente();" />
                        </vs-col>
                        <!-- busqueda de cliente -->
                        <vs-col vs-justify="center" vs-align="center" vs-w="12" v-else>
                            <DatosDespachoVue v-if="OtherClient" ref="clientePerseoRef" :empresa="String(acta.empresa)" @enviarDatosDespacho="enviarDatosDespacho" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="CI:" class="w-full" v-model="acta.ci" readonly />
                        </vs-col>
                    </vs-row>
                </vs-col>

                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <span v-if="mostrarMensajeVariacion">
                        <vs-alert color="danger" icon-pack="feather" icon="icon-info">
                            <span>Se ha creado un documento de venta con un número de <b>CI/RUC diferente</b>, verifica antes de continuar.</span>
                            <span v-if="arregloOtherUsers.length>0">
                                CI/RUC utilizados: <span v-for="(cliente, index) in arregloOtherUsers" :key="index"> <b class="px-2">{{ cliente.ruc_cliente }}</b></span>
                            </span>
                        </vs-alert>
                    </span>
                </vs-col>
            </vs-row>
        </vs-row>
        <vs-row v-if="acta.empresa">
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Detalle del pedido Libros Hijos Docentes</vs-divider>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                    <span class="flex justify-center items-center" v-if="acta.empresa == 1 || acta.empresa == 6?arregloLibros.some(tr => tr.p_libros_cantidad_pendiente > getStockDepositoValue(tr)):acta.empresa == 3?arregloLibros.some(tr => tr.p_libros_cantidad_pendiente > getStockDepositoValue(tr)):false">
                        <b>¿Activar todo el stock disponible?: </b>
                        <vs-switch class="m-5" v-model="switch_activar_todo_stock" @input="Switch_Activar_Desactivar_Todo_Stock()" />
                    </span>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                    <vs-table max-items="20" :data="arregloLibros">
                        <template slot="header">
                            <span>Cantidad: {{arregloLibros.length}}</span>
                            <span class="flex justify-center items-center" v-if="acta.empresa == 1 || acta.empresa == 6?arregloLibros.some(tr => tr.p_libros_cantidad_pendiente > getStockDepositoValue(tr)):acta.empresa == 3?arregloLibros.some(tr => tr.p_libros_cantidad_pendiente > getStockDepositoValue(tr)):false">
                                <b>Permitir Stock Disponible: </b>
                                <vs-switch class="m-5" v-model="permitirStock" />
                            </span>
                            <span>Descuento: {{porcentaje_descuento}}%</span>
                        </template>
                        <template slot="thead">
                            <vs-th>Codigo</vs-th>
                            <vs-th>Precio</vs-th>
                            <vs-th>Libro</vs-th>
                            <vs-th>Cant. unidades</vs-th>
                            <vs-th><span v-if="acta.empresa === 1 ">Stock disponible Notas (Prolipa)</span><span v-else>Stock disponible Notas (Calmed)</span></vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :state="tr.p_libros_cantidad_pendiente > getStockDepositoValue(tr)  ? 'danger':null" v-for="(tr, index) in data" :key="index">
                                <vs-td>{{ tr.pro_codigo }}</vs-td>
                                <vs-td>{{ tr.p_libros_valor_u }}</vs-td>
                                <vs-td>
                                    <span v-if="tr.id_serie === 19">
                                        <b>{{ tr.pro_nombre }}</b><br>
                                        <b>Descripción Combo: <br>{{ tr.descripcionlibro }}</b>
                                    </span>
                                    <span v-else><b>{{ tr.pro_nombre }}</b><br /></span>
                                </vs-td>
                                <vs-td>
                                    <div>
                                        Cantidad Solicitada: <b>{{ tr.p_libros_cantidad }}</b><br>
                                        <span v-if="tr.p_libros_cantidad_aprobada"> Cantidad Aprobada: <b>{{ tr.p_libros_cantidad_aprobada }}</b></span> <br>
                                        <span v-if="tr.p_libros_cantidad_pendiente"> Cantidad Pendiente: <b>{{ tr.p_libros_cantidad_pendiente }}</b></span> <br>
                                        <span v-if="tr.p_libros_cantidad_pendiente == 0"> <b style="color: #5cb85c;">Sin Cantidad pendiente</b></span>
                                        <vs-input v-if="tr.p_libros_cantidad_pendiente > getStockDepositoValue(tr)  && permitirStock" label="Cantidad Aprobada:" class="w-full" v-model.number="valorDespacho[index]" type="number" min="0" @input="validarCantidadAprobada(tr, index)" />
                                    </div>
                                </vs-td>
                                <vs-td>
                                    {{ getStockDepositoValue(tr)  }}
                                    <b class="ml-3" v-if="(tr.p_libros_cantidad_pendiente > getStockDepositoValue(tr)  )"> Stock insuficiente</b>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-col>
            </vs-col>
        </vs-row>
        <br><br>
        <vs-row v-if="acta.empresa">
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Totales del Documento</vs-divider>

                <vs-row>
                    <!-- COLUMNA IZQUIERDA: ERRORES Y ADVERTENCIAS -->
                    <vs-col vs-lg="6" vs-sm="12" vs-xs="12" class="px-4">
                        <!-- Mensajes de Error -->
                        <div v-if="totalesDocumento.tieneErrores" class="mb-4">
                            <vs-alert color="danger" icon-pack="feather" icon="icon-alert-triangle" active="true">
                                <span class="font-bold">Se encontraron {{ totalesDocumento.errores.length }} error(es) que deben corregirse:</span>
                                <div class="mt-2 max-h-64 overflow-y-auto">
                                    <div v-for="(error, idx) in totalesDocumento.errores" :key="idx" class="py-2 border-b border-red-200">
                                        <b>{{ error.codigo }}</b> - {{ error.nombre }}<br>
                                        <span class="text-sm">❌ {{ error.error }}: {{ error.detalle }}</span>
                                    </div>
                                </div>
                            </vs-alert>
                        </div>

                        <!-- Switch para generar con pendientes (visible si hay items pendientes) -->
                        <div v-if="totalesDocumento.itemsPendientes > 0" class="mb-4">
                            <div class="bg-orange-100 p-4 rounded-lg border-2 border-orange-300">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center flex-1">
                                        <vs-switch v-model="generarConPendientes" class="mr-3" />
                                        <div>
                                            <b class="text-base">✓ Generar acta con pendientes</b>
                                            <p class="text-sm text-gray-600 mt-1">
                                                {{ totalesDocumento.itemsPendientes }} item(s) quedarán pendientes para posterior aprobación
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="generarConPendientes" class="mt-3 pt-3 border-t border-orange-300">
                                    <p class="text-sm text-gray-700">
                                        📌 Se creará el acta con <b class="text-green-700">{{ totalesDocumento.itemsConCantidad }} items aprobados</b><br>
                                        📌 <b class="text-orange-700">{{ totalesDocumento.itemsPendientes }} items pendientes</b> quedarán en <b>estado PENDIENTE</b>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Alerta de items pendientes (solo si NO se activa el switch) -->
                        <div v-if="!totalesDocumento.tieneErrores && totalesDocumento.itemsPendientes > 0 && !generarConPendientes" class="mb-4">
                            <vs-alert color="warning" icon-pack="feather" icon="icon-info" active="true">
                                <span class="font-bold">Atención:</span> Active el switch arriba para generar el acta con {{ totalesDocumento.itemsPendientes }} item(s) pendientes.
                            </vs-alert>
                        </div>
                    </vs-col>

                    <!-- COLUMNA DERECHA: TOTALES -->
                    <vs-col vs-lg="6" vs-sm="12" vs-xs="12" class="px-4">
                        <div class="flex justify-end">
                            <table class="w-full">
                                <tbody>
                                    <tr class="border-b">
                                        <td class="py-2 text-right pr-4"><b>Items a aprobar:</b></td>
                                        <td class="py-2 text-right">
                                            <span :class="totalesDocumento.itemsConCantidad > 0 ? 'text-primary' : 'text-dark'">
                                                {{ totalesDocumento.itemsConCantidad }} / {{ arregloLibros.length }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr class="border-b" :class="{ 'opacity-50': totalesDocumento.tieneErrores }">
                                        <td class="py-2 text-right pr-4"><b>Subtotal:</b></td>
                                        <td class="py-2 text-right">
                                            <span>
                                                ${{ totalesDocumento.subtotal }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr class="border-b" :class="{ 'opacity-50': totalesDocumento.tieneErrores }">
                                        <td class="py-2 text-right pr-4"><b>Descuento ({{ porcentaje_descuento }}%):</b></td>
                                        <td class="py-2 text-right">
                                            <span>
                                                ${{ totalesDocumento.descuento }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr :class="{ 'opacity-50': totalesDocumento.tieneErrores }">
                                        <td class="py-3 text-right pr-4"><b class="text-lg">TOTAL:</b></td>
                                        <td class="py-3 text-right">
                                            <span :class="totalesDocumento.tieneErrores ? 'text-danger' : 'text-success'" class="text-lg font-bold">
                                                ${{ totalesDocumento.total }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <div v-if="acta.empresa">
            <vs-row>
                <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-textarea label="Observación:" placeholder="Escribe..." class="w-full" v-model="acta.observacion" />
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button
                    @click="validarYGuardarActa();"
                    type="relief"
                    color="success"
                    :disabled="totalesDocumento.tieneErrores || (totalesDocumento.itemsPendientes > 0 && !generarConPendientes)"
                >
                    <span v-if="totalesDocumento.tieneErrores">❌ Corrija los errores para guardar</span>
                    <span v-else-if="totalesDocumento.itemsPendientes > 0 && !generarConPendientes">⚠️ Active "Generar con pendientes" para continuar</span>
                    <span v-else-if="generarConPendientes">✓ Guardar Acta (Con Pendientes)</span>
                    <span v-else>✓ Guardar Acta</span>
                </vs-button>&emsp;
                <vs-button @click="popupActa=false; permitirStock=false; generarConPendientes=false" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </div>
        <!-- Popup para stock insuficientes -->
        <vs-popup v-if="popupActivoErrorStock" @close="changeHandleErrorStock(1)" class="popopPadre" title="Stock's insuficientes" :active.sync="popupActivoErrorStock">
            <ErroresStock v-if="popupActivoErrorStock" :erroresStock_Lista="erroresStock_Lista" @change="changeHandleErrorStock" />
        </vs-popup>
    </vs-popup>
    <vs-popup fullscreen :title="`Cambio del Pedido Libros Hijos Docentes n° ${librosObsequios.id}`" :active.sync="popupDetallesActa" class="popopPadre">
        <div v-if="popupDetallesActa">
            <screenModificacionPedido v-if="popupDetallesActa" :librosObsequios="librosObsequios" class="mt-2" :sendPedido="sendPedido" :userRoot="Boolean(userRoot)" />
        </div>
    </vs-popup>
    <vs-popup class="holamundo" title="Confirmacion Preaprobacion" :active.sync="popupPreAprobacion">
        <p class="text-danger text-3xl"><b class="ml-2">Estas seguro de autorizar el pedido Libros Hijos Docentes al hacerlo se guardara, para posterior aprobacion de facturador Administrator</b></p>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-3">
            <vs-button @click="aceptarLibrosObsequios(librosObsequios,7);" type="relief" color="danger">Preaprobar</vs-button>&emsp;
            <vs-button @click="popupPreAprobacion=false;" color="primary" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup class="holamundo" title="Confirmacion Anulacion" :active.sync="popupAnulacion">
        <p class="text-danger text-2xl"><b class="ml-2">Se anulara el pedido Libros Obsequios N° {{ datosAnularLibrosObsequios.id }} Tambien se anulara los siguientes Documentos</b></p>
        <vs-table max-items="10" :data="arregloActas">
            <template slot="thead">
                <vs-th>Acta #</vs-th>
                <vs-th>Fecha Acta</vs-th>
            </template>
            <template slot-scope="{ data }">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> {{ tr.ven_codigo }} </vs-td>
                    <vs-td> {{ tr.ven_fecha }} </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <div>
            <!--observacion anulacion hijos docentes-->
            <vs-input v-model="observacionAnulacion" class="w-full mt-4" label="OBSERVACIÓN ANULACIÓN(Obligatorio)" />
        </div>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-3">
            <vs-button @click="AnularLibrosObsequios(datosAnularLibrosObsequios,1);" type="relief" color="danger">Confirmar</vs-button>&emsp;
            <vs-button @click="popupAnulacion=false;" color="primary" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup v-if="popupVerActasLibrosObsequios" class="informacionformhijo" :title="`Actas Libros Obsequios ${NumeroPedido}`" :active.sync="popupVerActasLibrosObsequios">
        <actasLibrosObsequios v-if="popupVerActasLibrosObsequios" :librosObsequios="librosObsequios"  @retorn="updateLibrosObsequios"/>
    </vs-popup>
</vx-card>
</template>


<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select';
const resumenLibrosObsequiosVue = () => import('./resumenLibrosObsequios.vue')
const detalleAprobadorLibrosObsequios = () => import('./detalleAprobadorLibrosObsequios.vue')
const screenPedidoLibrosObsequiosVue = () => import('./screenPedidoLibrosObsequios.vue')
const screenModificacionPedido = () => import('./screenModificacionPedido.vue')
const exportLibrosObsequiosVueVue = () => import('./components/exportLibrosObsequios.vue')
const exportDetalleLibrosObsequios = () => import('./components/exportDetalleLibrosObsequios.vue')
const actasLibrosObsequios = () => import('./components/ActasLibrosObsequios.vue')
const DatosDespachoVue = () => import('@/views/pedidos2/pedidos/proforma/components/DatosDespachoUsuario.vue')
const ErroresStock = () => import("@/views/pedidos2/pedidos/libros/librosObsequios/Stocks_Insuficientes_LibrosObsequio.vue");
import PedidosRepository from "../../../../../repositories/PedidosRepository";
export default {
    components: {
        resumenLibrosObsequiosVue,
        screenPedidoLibrosObsequiosVue,
        exportLibrosObsequiosVueVue,
        exportDetalleLibrosObsequios,
        detalleAprobadorLibrosObsequios,
        actasLibrosObsequios,
        screenModificacionPedido,
        DatosDespachoVue,
        'v-select': vSelect,
        ErroresStock,
    },
    props: {},

    data() {
        return {
            usuario: [],
            arregloOtherUsers: [],
            arregloLibrosObsequios: [],
            arregloLibros: [],
            arregloActas: [],
            datosAnularLibrosObsequios: [],
            datosActa: {},
            listaEmpresas: [],
            librosObsequios: {},
            DatosAprobar: {},
            pedido: {},
            pedidoLibrosObsequios: {
                observacion_asesor: '',
            },
            selectedOption: '',
            acta: {
                codigoPedidoLibrosActa: '',
                id_pedido_librosObsequios: '',
                empresa: '',
                institucion: '',
                responsable: '',
                ci: '',
                direccion: '',
                telefono: '',
                observacion: '',
                descuento: '',
                descuentoInstitucion: '',
                beneficiario: '',
            },
            menu: 0,
            popupCarga: false,
            popupReportePedidoLibroObsequio: false,
            popupDetallePedidoLibroObsequio: false,
            popupPreAprobacion: false,
            popupAnulacion: false,
            tipoFile: 0,
            sendPedido: '',
            seleccion: '',
            idDato: 0,
            institucion: '',
            institucion: '',
            observacion_detalle: '',
            porcentaje_detalle: '',
            popupActa: false,
            exportTodo: false,
            codigoActa: [],
            popupDatosDetalle: false,
            mostrarMensajeEnviado: false,
            itemsDelPedido: 0,
            valorDespacho: [],
            permitirStock: false,
            datosAprobados: false,
            arregloBeneficiario: [],
            stockMinimoNotas: '',
            porcentaje_descuento: '',
            estadoPedidoLibrosHijosDocentes: '',
            estadoP: '',
            datoidAprobador: '',
            datonombreAprobador: '',
            validacionObsequio: false,
            isDifferent: false,
            mostrarMensajeVariacion: false,
            editActaPedido: [],
            popupDetallesActa: false,
            mostrardatosDetalles: false,
            OtherClient: false,

            //ver actas
            popupVerActasLibrosObsequios: false,
            NumeroPedido: '',

            //anular
            observacionAnulacion: '',
            switch_activar_todo_stock: false,
            popupActivoErrorStock: false,
            erroresStock_Lista: [],
            generarConPendientes: false,
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor']),

        usarComponenteNuevo() {
            return localStorage.getItem('usarComponenteNuevo') === 'true';
        },

        totalesDocumento() {
            let me = this;
            let subtotal = 0;
            let descuento = 0;
            let total = 0;
            let itemsConCantidad = 0;
            let itemsSinCantidad = 0;
            let itemsPendientes = 0; // Items con cantidad aprobada menor a la solicitada
            let errores = [];

            if (me.arregloLibros.length > 0) {
                me.arregloLibros.forEach((libro, index) => {
                    let cantidad_aprobada = 0;
                    let stockDisponible = 0;

                    // Determinar stock disponible
                    if (me.acta.empresa === 1) {
                        stockDisponible = me.switch_activar_todo_stock ? libro.totalStock : libro.pro_deposito;
                    } else if (me.acta.empresa === 3) {
                        stockDisponible = me.switch_activar_todo_stock ? libro.totalStock : libro.pro_depositoCalmed;
                    }

                    // Determinar la cantidad aprobada según la lógica existente
                    if (me.acta.empresa === 1) {
                        cantidad_aprobada = me.permitirStock && (libro.p_libros_cantidad_pendiente > stockDisponible)
                            ? (me.valorDespacho[index] || 0)
                            : libro.p_libros_cantidad_pendiente;
                    } else if (me.acta.empresa === 3) {
                        cantidad_aprobada = me.permitirStock && (libro.p_libros_cantidad_pendiente > stockDisponible)
                            ? (me.valorDespacho[index] || 0)
                            : libro.p_libros_cantidad_pendiente;
                    }

                    // Validar si hay errores
                    if (libro.p_libros_cantidad_pendiente > stockDisponible && !me.permitirStock) {
                        errores.push({
                            codigo: libro.pro_codigo,
                            nombre: libro.pro_nombre,
                            error: 'Stock insuficiente',
                            detalle: `Requiere ${libro.p_libros_cantidad_pendiente}, disponible ${stockDisponible}`
                        });
                    } else if (me.permitirStock && libro.p_libros_cantidad_pendiente > stockDisponible) {
                        if (!me.valorDespacho[index] || me.valorDespacho[index] <= 0) {
                            errores.push({
                                codigo: libro.pro_codigo,
                                nombre: libro.pro_nombre,
                                error: 'Cantidad aprobada requerida',
                                detalle: 'Debe ingresar una cantidad válida'
                            });
                        } else if (me.valorDespacho[index] > stockDisponible) {
                            errores.push({
                                codigo: libro.pro_codigo,
                                nombre: libro.pro_nombre,
                                error: 'Excede stock disponible',
                                detalle: `Ingresó ${me.valorDespacho[index]}, disponible ${stockDisponible}`
                            });
                        }
                    }

                    // Verificar si este item tiene error
                    const tieneError = errores.some(e => e.codigo === libro.pro_codigo);

                    // Contar items con y sin cantidad (solo los que NO tienen error)
                    if (cantidad_aprobada > 0 && !tieneError) {
                        itemsConCantidad++;
                        subtotal += libro.p_libros_valor_u * cantidad_aprobada;
                    } else if (cantidad_aprobada <= 0 && !tieneError) {
                        itemsSinCantidad++;
                    }

                    // Items pendientes = items donde la cantidad aprobada es DIFERENTE a la cantidad solicitada
                    // Solo cuenta pendientes si no hay errores y la cantidad aprobada es válida pero diferente
                    if (!tieneError) {
                        if (cantidad_aprobada > 0 && cantidad_aprobada < libro.p_libros_cantidad_pendiente) {
                            itemsPendientes++;
                        } else if (cantidad_aprobada === 0 && libro.p_libros_cantidad_pendiente > 0) {
                            itemsPendientes++;
                        }
                    }
                });

                // Calcular descuento
                descuento = (subtotal * me.porcentaje_descuento) / 100;
                total = subtotal - descuento;
            }

            return {
                subtotal: subtotal.toFixed(2),
                descuento: descuento.toFixed(2),
                total: total.toFixed(2),
                itemsConCantidad: itemsConCantidad,
                itemsSinCantidad: itemsSinCantidad,
                itemsPendientes: itemsPendientes,
                errores: errores,
                tieneErrores: errores.length > 0
            };
        }
    },
    watch: {
        permitirStock(newVal) {
            if (newVal) {
                this.verificarYActivarPendientes();
            }
        },
        valorDespacho: {
            handler() {
                if (this.permitirStock) {
                    this.verificarYActivarPendientes();
                }
            },
            deep: true
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        // this.$on('guardar-informacion', () => {
        //     this.mostrarMensaje = true;
        // });
    },
    mounted() {
        let me = this;
        me.sendPedido = me.ObjectPedido
        me.pedido.id_pedido = me.sendPedido.id_pedido
        me.getProductosStockMinimoNotas()
        if (me.usuario.id_group == 22 || me.usuario.id_group == 23) {
            me.getLibrosObsequios(6)
            me.seleccion = 'gerencia1'
        } else {
            me.getLibrosObsequios(0)
        }
        this.mostrarMensajeEnviado = false;
    },
    methods: {
        updateLibrosObsequios() {
            let me = this;
            me.getLibrosObsequios(0)
        },
        handleButtonClick() {
            // Llamar al método verificarCantidadesPedidoLibrosobsequios() en el hijo
            this.$refs.screenPedidoLibrosObsequios.verificarCantidadesPedidoLibrosobsequios();
        },
        limpiarCliente() {
            this.acta.beneficiario = '';
            this.acta.ci = '';
            this.mostrarMensajeVariacion = false;
        },
        evaluarCedulaCliente() {
            let me = this;
            const rucCliente = this.acta.ci;
            if (rucCliente.length > 0) {
                if (me.arregloOtherUsers.length > 0) {
                    this.isDifferent = !this.arregloOtherUsers.some(usuario => usuario.ruc_cliente === rucCliente);
                    if (this.isDifferent) {
                        this.mostrarMensajeVariacion = true;
                        console.log("El CI es diferente a los ruc_cliente en arregloUsuario.");
                    } else {
                        this.mostrarMensajeVariacion = false;
                        console.log("El CI es igual a uno de los ruc_cliente en arregloUsuario.");
                    }
                }
            }
        },
        abrirModificacionPedidoActa(tr) {
            let me = this;
            setTimeout(() => {
                me.popupDetallesActa = true;
            }, 100);
        },
        abrirAnularLibrosObsequios(tr, estado) {
            let me = this;
            me.datosAnularLibrosObsequios = tr;
            me.getLibros(tr.id)
            me.popupAnulacion = true;

        },
        getLibros(dato) {
            this.$vs.loading();
            this.$http
                .get(this.$server_url + "obtenerDocumentosLibrosObsequios/" + dato)
                .then((res) => {
                    this.arregloActas = res.data;
                    this.$vs.loading.close();
                })
                .catch((error) => {
                    console.error(error);
                    this.$vs.loading.close();
                });
        },
        enviarDatosDespacho(e) {
            let me = this
            console.log("enviarDatosDespacho", e)
            me.acta.ci = e.cedula
            me.acta.beneficiario = e.idusuario
            setTimeout(function () {
                me.evaluarCedulaCliente();
            }, 100);
        },
        // AnularLibrosObsequios(tr, estado) {
        //     let me = this;
        //     let formData = new FormData();
        //     formData.append('id', tr.id);
        //     formData.append('estado_libros_obsequios', estado);
        //     me.$vs.loading();
        //     this.$http.post(this.$server_url + 'AnularLibrosObsequios', formData)
        //         .then(function (res) {
        //             me.$vs.loading.close()
        //             if (res.data.status == 0) {
        //                 me.$vs.notify({
        //                     text: res.data.message,
        //                     color: 'warning',
        //                     iconPack: 'feather',
        //                     icon: 'icon-alert-triangle'
        //                 })
        //                 return
        //             }
        //             me.getLibrosObsequios(0)
        //             me.menu = 0
        //             me.popupAnulacion = false;
        //             me.$vs.notify({
        //                 text: res.data.message,
        //                 color: 'primary',
        //                 iconPack: 'feather',
        //                 icon: 'icon-alert-triangle'
        //             })
        //         })
        //         .catch(function (error) {
        //             me.$vs.loading.close()
        //         })
        // },
        AnularLibrosObsequios(tr, estado) {
            let me = this;
            if (!this.observacionAnulacion) {
                me.$vs.notify({
                    text: 'Debe escribir un observación antes de anular',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let formData = new FormData();
            formData.append('id', tr.id);
            formData.append('estado_libros_obsequios', estado);
            formData.append('observacion', this.observacionAnulacion);
            formData.append('usuario', this.usuario.idusuario);

            me.$vs.loading();
            this.$http.post(this.$server_url + 'AnularLibrosObsequios', formData)
                .then(function (res) {
                    me.$vs.loading.close();
                    if (res.data.status == 0) {
                        // Mostrar el mensaje de error con el documento que causó el fallo
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }

                    me.getLibrosObsequios(0);
                    me.menu = 0;
                    me.popupAnulacion = false;
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-check-circle'
                    });
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                });
        },
        ponerCedulaCliente() {
            // Encuentra el beneficiario seleccionado
            const seleccionado = this.arregloBeneficiario.find(beneficiario => beneficiario.id_usuario == this.acta.beneficiario);

            if (seleccionado) {
                // Si hay un beneficiario seleccionado, asigna su cédula
                this.acta.ci = seleccionado.cedula;
            } else {
                // Si no hay beneficiario seleccionado, limpia el campo de cédula
                this.acta.ci = '';
            }
        },
        Switch_Activar_Desactivar_Todo_Stock() {
            let me = this;
            this.permitirStock = false;
            // Limpiar todos los valores de `valorDespacho`
            // this.valorDespacho = this.valorDespacho.map(() => 0);
            if (this.switch_activar_todo_stock == true) {
                me.arregloLibros.forEach((tr, index) => {
                    this.$set(this.valorDespacho, index, Math.max(tr.totalStock, 0));
                });
            } else if (this.switch_activar_todo_stock == false) {
                if (this.acta.empresa == 1 || this.acta.empresa == 6) {
                    me.arregloLibros.forEach((tr, index) => {
                        this.$set(this.valorDespacho, index, Math.max(tr.pro_deposito, 0));
                    });
                } else if (this.acta.empresa == 3) {
                    me.arregloLibros.forEach((tr, index) => {
                        this.$set(this.valorDespacho, index, Math.max(tr.pro_depositoCalmed, 0));
                    });
                }
            }
        },
        getStockDepositoValue(tr) {
            // console.log(tr, this.switch_activar_todo_stock, "dddddaaas");
            if (this.switch_activar_todo_stock == true) {
                if (this.acta.empresa == 1 || this.acta.empresa == 3 || this.acta.empresa == 6) {
                    return tr.totalStock;
                } else {
                    return 0; // Valor por defecto
                }
            } else if (this.switch_activar_todo_stock == false) {
                if (this.acta.empresa === 1 || this.acta.empresa === 6) {
                    return tr.pro_deposito;
                } else if (this.acta.empresa === 3) {
                    return tr.pro_depositoCalmed; // Cambia a tr.pro_depositoCalmed cuando acta.empresa es 3
                } else {
                    return 0; // Valor por defecto
                }
            }
        },
        getProductosStockMinimoNotas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getProductosStockMinimoNotas')
                .then(function (res) {
                    me.stockMinimoNotas = res.data[0].minimo
                    console.log(me.stockMinimoNotas, 'minimo')
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        validarCantidadAprobada(tr, index) {
            if (this.switch_activar_todo_stock == true) {
                if (this.acta.empresa == 1 ||  this.acta.empresa == 3 || this.acta.empresa == 6) {
                    if (this.valorDespacho[index] > tr.totalStock) {
                        this.valorDespacho[index] = tr.totalStock;
                    } else if (this.valorDespacho[index] < 0) {
                        this.valorDespacho[index] = 0;
                    }
                }
            } else if (this.switch_activar_todo_stock == false) {
                if (this.acta.empresa === 1) {
                    if (this.valorDespacho[index] > tr.pro_deposito) {
                        this.valorDespacho[index] = Math.max(tr.pro_deposito, 0);
                    } else if (this.valorDespacho[index] < 0) {
                        this.valorDespacho[index] = 0;
                    }
                } else if (this.acta.empresa === 3) {
                    if (this.valorDespacho[index] > tr.pro_depositoCalmed) {
                        this.valorDespacho[index] = Math.max(tr.pro_depositoCalmed, 0);
                    } else if (this.valorDespacho[index] < 0) {
                        this.valorDespacho[index] = 0;
                    }
                }
                console.log("valor despacho", this.valorDespacho[index])
            }
            // Verificar si debe activarse generarConPendientes
            this.verificarYActivarPendientes();
        },
        verificarYActivarPendientes() {
            let me = this;
            if (!me.permitirStock || me.arregloLibros.length === 0) {
                me.generarConPendientes = false;
                return;
            }

            let hayPendientes = false;

            me.arregloLibros.forEach((libro, index) => {
                let stockDisponible = 0;

                if (me.acta.empresa === 1) {
                    stockDisponible = me.switch_activar_todo_stock ? libro.totalStock : libro.pro_deposito;
                } else if (me.acta.empresa === 3) {
                    stockDisponible = me.switch_activar_todo_stock ? libro.totalStock : libro.pro_depositoCalmed;
                }

                const cantidadAprobada = me.valorDespacho[index];
                const cantidadSolicitada = libro.p_libros_cantidad_pendiente;

                // Hay pendiente si se ingresó una cantidad aprobada válida Y es diferente a la solicitada
                if (cantidadAprobada !== undefined && cantidadAprobada !== null && cantidadAprobada !== '' && cantidadAprobada > 0) {
                    if (cantidadAprobada !== cantidadSolicitada) {
                        hayPendientes = true;
                    }
                }
            });

            // Activar o desactivar automáticamente generarConPendientes según haya pendientes reales
            me.generarConPendientes = hayPendientes;
        },
        vacilarEmits() {
            this.itemsDelPedido = 0;
            this.estadoPedidoLibrosHijosDocentes = '';
            this.validacionObsequio = false;
        },
        recibirCantidad(cantidad, estado, obsequio) {
            this.vacilarEmits();
            if (cantidad) {
                this.itemsDelPedido = cantidad;
                if (cantidad > 0) {
                    this.mostrarMensajeEnviado = true;
                }
            }
            if (estado) {
                this.estadoPedidoLibrosHijosDocentes = estado;
            }
            if (obsequio) {
                this.validacionObsequio = obsequio;
            }
            console.log("Cantidad de libros recibidos:", cantidad, 'con el estado de', estado, 'es obsequio:', obsequio);

        },
        getLibrosObsequios(tipo) {
            let me = this;
            if (tipo == 0) {
                me.exportTodo = false;
                me.mostrarMensajeEnviado = false;
            }
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getLibrosObsequios?id_pedido=' + me.pedido.id_pedido + '&usuario=' + me.usuario.id_group)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arregloLibrosObsequios = res.data
                    if (me.usuario.id_group == 22) {
                        let datos = res.data.filter(p => (p.estado_libros_obsequios == 0 || (p.estado_libros_obsequios == 3 && p.porcentaje_descuento < 100) || p.estado_libros_obsequios == 4 || p.estado_libros_obsequios == 5 || p.estado_libros_obsequios == 6 || p.estado_libros_obsequios == 7 || p.estado_libros_obsequios == 2 || p.estado_libros_obsequios == 8))
                        me.arregloLibrosObsequios = datos
                    }
                    if (tipo == 1) {
                        let datos = res.data.filter(p => p.estado_libros_obsequios == 0)
                        me.librosObsequios = datos[0]
                        me.menu = 3
                        me.exportTodo = false
                        me.mostrarMensajeEnviado = false;
                    }
                    // if (tipo == 5) {
                    //     let datos = res.data.filter(p => p.estado_libros_obsequios == 4)
                    //     me.arregloLibrosObsequios = datos
                    //     me.exportTodo=false
                    //     me.mostrarMensajeEnviado = false;
                    // }
                    if (tipo == 6) {
                        let datos;
                        if (me.usuario.id_group == 23 || me.usuario.id_group == 1 || me.usuario.id_group == 0) {
                            datos = res.data.filter(p => (p.estado_libros_obsequios == 7 || p.estado_libros_obsequios == 0 || p.estado_libros_obsequios == 3 || p.estado_libros_obsequios == 4 || p.estado_libros_obsequios == 6 || p.estado_libros_obsequios == 8))
                        } else if (me.usuario.id_group == 22) {
                            datos = res.data.filter(p => (p.estado_libros_obsequios == 0 || (p.estado_libros_obsequios == 3 && p.porcentaje_descuento < 100) || p.estado_libros_obsequios == 4 || p.estado_libros_obsequios == 6 || p.estado_libros_obsequios == 8))
                        }
                        me.arregloLibrosObsequios = datos
                        me.exportTodo = false
                        me.mostrarMensajeEnviado = false;
                    }
                    if (tipo == 7) {
                        let datos = res.data.filter(p => p.estado_libros_obsequios == 5)
                        me.arregloLibrosObsequios = datos
                        me.exportTodo = true
                        me.mostrarMensajeEnviado = false;
                        console.log(me.arregloLibrosObsequios.length)
                        if (me.arregloLibrosObsequios.length > 0) {
                            me.datosAprobados = me.arregloLibrosObsequios.length;
                        }
                    }
                    if (tipo == 8) {
                        let datos = res.data.filter(p => p.estado_libros_obsequios == 2)
                        me.arregloLibrosObsequios = datos
                        me.exportTodo = false
                        me.mostrarMensajeEnviado = false;
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        mostrarResumen(tr) {
            let me = this;
            me.menu = 2
        },
        mostrarDetalle(tr) {
            let me = this;
            me.menu = 5
        },
        eliminarLibrosObsequios() {
            let me = this;
            let formData = new FormData();
            formData.append('id', me.librosObsequios.id);
            formData.append('id_pedido', me.pedido.id_pedido);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'eliminarPedidoLibrosObsequios', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Se elimino correctamente el pedido libros obsequips',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getLibrosObsequios(0)
                    me.menu = 0
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        async guardarValorPedidoLibrosObsequios() {
            let me = this
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let formData = new FormData();
            formData.append('id', 0)
            formData.append('user_created', usuarioObjeto.idusuario);
            formData.append('id_periodo', me.sendPedido.id_periodo);
            formData.append('id_pedido', me.pedido.id_pedido);
            formData.append('total_unidades', 0);
            this.$http.post(this.$server_url + 'guardarValorPedidoLibrosObsequios', formData)
                .then(function (res) {
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time: 7000,
                        })
                        return
                    }
                    me.$vs.notify({
                        text: 'Se guardo correctamente',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getLibrosObsequios(1)
                })
                .catch(function (error) {})
        },
        puedeRevertirAprobacion() {
            if (this.userRoot == true) {
                return true;
            }

            if (this.groupFacturador) {
                return true;
            }

            if (this.usuario.id_group == 22 || this.usuario.id_group == 23) {
                return true;
            }

            return false;
        },
        revertirAprobacionLibrosObsequios(tr) {
            let me = this;
            me.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Revertir aprobación',
                text: tr.ifObsequio == 1 ? 'Este pedido volverá a pedido obsequio no aprobado. ¿Desea continuar?' : 'Este pedido volverá a por aprobar. ¿Desea continuar?',
                accept: function () {
                    let formData = new FormData();
                    formData.append('id', tr.id);
                    formData.append('user_created', me.usuario.idusuario);

                    me.$vs.loading();
                    me.$http.post(me.$server_url + 'RevertirAprobacionLibrosObsequios', formData)
                        .then(function (res) {
                            me.$vs.loading.close();
                            if (res.data.status == 0) {
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-alert-triangle'
                                });
                                return;
                            }

                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check-circle'
                            });
                            me.getLibrosObsequios(0);
                            me.rechargePedido();
                        })
                        .catch(function () {
                            me.$vs.loading.close();
                        });
                },
                acceptText: 'Sí, revertir',
                cancelText: 'Cancelar'
            });
        },
        VerificacionRechazoPedido(tr) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar rechazo `,
                acceptText: 'Si, deseo rechazar el pedido Libros Hijos Docentes.',
                cancelText: 'Cancelar',
                text: 'Estás seguro de rechazar el pedido Libros Hijos Docentes.',
                accept: () => this.CambiarEstadoPedidoLibrosObsequios(tr, 2) // Cambio aquí
            })
        },
        CambiarEstadoPedidoLibrosObsequios(tr, estado) {
            let me = this;
            let formData = new FormData();
            formData.append('id', tr.id);
            formData.append('estado_libros_obsequios', estado);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'changeEstadoPedidoLibrosObsequios', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getLibrosObsequios(0)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        CambiarEstadoLibrosObsequios(tr, estado) {
            let me = this;
            // Validación opcional de observación para asesores solo si ya tiene observación previa
            // if (me.usuario.id_group == 11) {
            //     if (!this.pedidoLibrosObsequios.observacion_asesor) {
            //         this.$vs.notify({
            //             text: 'Escriba la observación antes de enviar.',
            //             color: 'danger',
            //             iconPack: 'feather',
            //             icon: 'icon-alert-triangle'
            //         });
            //         return;
            //     }
            // }
            if (me.itemsDelPedido <= 0) {
                this.$vs.notify({
                    text: 'No tiene items para guardar.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let formData = new FormData();
            formData.append('id', tr.id);
            formData.append('estado_libros_obsequios', estado);
            formData.append('obsequio', me.validacionObsequio);
            if (me.usuario.id_group == 11) {
                // Guardar observación del asesor (puede estar vacía)
                formData.append('observacion_asesor', me.pedidoLibrosObsequios.observacion_asesor || '');
            } else {
                formData.append('observacion_asesor', 'No creado por un Asesor');
            }
            me.$vs.loading();
            this.$http.post(this.$server_url + 'CambiarEstadoLibrosObsequios', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.getLibrosObsequios(0)
                    me.menu = 0
                    me.pedidoLibrosObsequios.observacion_asesor = ''
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        openConfirmLibrosObsequios() {
            let me = this;
            me.popupPreAprobacion = true;
        },

        aprobarLibrosObsequiosSoloEstado(tr) {
            let me = this;

            // Confirmar la aprobación (el backend determina el estado según el id_group del usuario)
            me.$vs.dialog({
                type: 'confirm',
                color: 'success',
                title: `Aprobar Pedido Libros Obsequios`,
                text: `¿Estás seguro de aprobar este pedido?`,
                accept: () => {
                    // Llamar al nuevo método que determina el estado en backend
                    let formData = new FormData();
                    formData.append('id', tr.id);
                    formData.append('observacion_asesor', me.pedidoLibrosObsequios.observacion_asesor || 'Aprobado desde nuevo flujo');
                    formData.append('user_created_name', me.usuario.nombres + ' ' + me.usuario.apellidos);
                    formData.append('user_created', me.usuario.idusuario);

                    me.$vs.loading();
                    me.$http.post(me.$server_url + 'AprobarLibrosObsequiosSoloEstado', formData)
                        .then(function (res) {
                            me.$vs.loading.close();
                            if (res.data.status == 0) {
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-alert-triangle'
                                });
                                return;
                            }

                            // Mostrar mensaje personalizado según el tipo de aprobación
                            let mensaje = res.data.message || 'Pedido aprobado correctamente';
                            if (res.data.tipo_aprobacion) {
                                mensaje = `Pedido aprobado correctamente como ${res.data.tipo_aprobacion}`;
                            }

                            me.$vs.notify({
                                text: mensaje,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });

                            me.getLibrosObsequios(0);
                            me.rechargePedido();
                            me.popupPreAprobacion = false;
                        })
                        .catch(function (error) {
                            me.$vs.loading.close();
                            me.$vs.notify({
                                text: 'Error al aprobar el pedido',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        });
                },
                acceptText: 'Sí, aprobar',
                cancelText: 'Cancelar'
            });
        },

        aceptarLibrosObsequios(tr, estado) {
            let me = this;
            let formData = new FormData();
            formData.append('id', tr.id);
            formData.append('estado_libros_obsequios', estado);
            formData.append('observacion_asesor', me.pedidoLibrosObsequios.observacion_asesor);
            formData.append('user_created_name', me.usuario.nombres + ' ' + me.usuario.apellidos);
            formData.append('user_created', me.usuario.idusuario);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'AceptarLibrosObsequiosFacturador', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.popupPreAprobacion = true;
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return

                    } else {
                        me.$vs.notify({
                            text: 'Se guardo correctamente',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.getLibrosObsequios(0)
                        me.rechargePedido()
                        me.popupPreAprobacion = false;
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        rechargePedido() {
            let me = this
            PedidosRepository.getPedidoXID(me.sendPedido.id_pedido).then(r => {
                this.$store.dispatch('setPedido', r.data[0]);
            })
        },
        VerActasLibrosObsequios(tr) {
            let me = this;
            this.NumeroPedido = '';
            // me.menu = 6;
            this.NumeroPedido = tr.id;
            this.popupVerActasLibrosObsequios = true;
        },
        realizarReporte(tipo) {
            let me = this;
            me.tipoFile = tipo
            me.popupCarga = true
            me.popupReportePedidoLibroObsequio = true
        },
        AbrirDatosDetalle() {
            let me = this;
            me.porcentaje_detalle = ''
            me.observacion_detalle = ''
            me.popupDatosDetalle = true
        },
        guardarDatosDetalle() {
            let me = this;
            me.realizarDetalle(1)
            me.popupDatosDetalle = false
            // let formData = new FormData();
            // formData.append('id_pedidoLibrosObsequios', me.datosActa.id);
            // formData.append('contrato', me.librosObsequios.contrato_generado);
            // this.$http.post(this.$server_url + 'AceptarLibrosObsequios', formData)
            // .then(function (res) {
            //         me.$vs.loading.close()
            //         if (res.data.status == 0) {
            //             me.$vs.notify({
            //                 text: res.data.message,
            //                 color: 'warning',
            //                 iconPack: 'feather',
            //                 icon: 'icon-alert-triangle'
            //             })
            //             return
            //         }
            //         me.$vs.notify({
            //             text: 'Se guardo correctamente',
            //             color: 'primary',
            //             iconPack: 'feather',
            //             icon: 'icon-alert-triangle'
            //         })
            //         me.popupDatosDetalle = false
            //         me.realizarDetalle(1)
            //     })
            //     .catch(function (error) { me.$vs.loading.close() })

        },
        realizarDetalle(tipo) {
            let me = this;
            this.tipoFile = tipo
            this.popupCarga = true
            this.popupDetallePedidoLibroObsequio = true
        },
        changeHandle(e) {
            let me = this;
            this.popupCarga = false
            this.popupReportePedidoLibroObsequio = false
            this.popupDetallePedidoLibroObsequio = false
        },
        getEmpresas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    this.listaEmpresas = res.data.filter(empresa => empresa.id != 2);
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        getLibrosObsequiosActa(id) {
            let me = this;
            let id_pedido_obsequio = id;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getLibrosObsequiosActa?id_pedido_obsequio=' + id_pedido_obsequio)
                .then(res => {
                    this.datosActa = res.data;
                    this.acta.institucion = this.datosActa[0].nombreInstitucion;
                    this.acta.id_pedido_librosObsequios = this.datosActa[0].id;
                    this.acta.responsable = this.datosActa[0].asesor;
                    this.acta.estado_libros_obsequios = this.datosActa[0].estado_libros_obsequios;
                    this.acta.ci = '';
                    // this.acta.ci = this.datosActa[0].cedulaAsesor;
                    this.acta.direccion = this.datosActa[0].direccionInstitucion;
                    this.acta.telefono = this.datosActa[0].telefonoInstitucion;
                    this.tipo_venta = this.datosActa[0].tipo_venta;
                    this.institucion = this.datosActa[0].institucion;
                    this.acta.descuentoInstitucion = this.datosActa[0].porcentaje;
                    this.acta.descuento = 100;
                    this.getOtherUsers(this.institucion);
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        getLibrosActa(idPedidoObsequio) {
            let me = this;
            this.switch_activar_todo_stock = false;
            me.arregloLibros = [];
            // this.$http.get(this.$server_url+'get_val_pedidoInfo_librosObsequios/'+idPedido+'/'+idPedidoObsequio)
            this.$http.get(this.$server_url + 'obtenerDatosDetalleLibros/' + idPedidoObsequio)
                .then(res => {
                    let datos = res.data;
                    // Asignar valores a disponibilidad
                    this.arregloLibros = datos.map(item => {
                        // Formatear valores negativos a 0
                        let pro_deposito = Math.max(item.pro_deposito, 0);
                        let pro_depositoCalmed = Math.max(item.pro_depositoCalmed, 0);
                        let pro_stock = Math.max(item.pro_stock, 0);
                        let pro_stockCalmed = Math.max(item.pro_stockCalmed, 0);
                        let pro_reservar = Math.max(item.pro_reservar, 0);

                        // Suma de todos los stocks
                        let sumaStocks = pro_stock + pro_stockCalmed + pro_deposito + pro_depositoCalmed;
                        // El valor de totalStock siempre como pro_reservar
                        let totalStock = pro_reservar;

                        // Lógica de asignación de totalStock
                        // Si la suma de los stocks es mayor que el valor a reservar
                        if (sumaStocks > pro_reservar) {
                            // Si es bodega 1, asignar pro_reservar a pro_deposito
                            if (me.acta.empresa == 1 || me.acta.empresa == 6) {
                                pro_deposito = pro_reservar;
                            }
                            // Si es bodega 3, asignar pro_reservar a pro_depositoCalmed
                            else if (me.acta.empresa == 3) {
                                pro_depositoCalmed = pro_reservar;
                            }
                        }
                        return {
                            ...item,
                            pro_deposito,
                            pro_depositoCalmed,
                            pro_stock,
                            pro_stockCalmed,
                            pro_reservar,
                            totalStock,
                        };
                    });
                    if (this.acta.empresa == 1 || this.acta.empresa == 6) {
                        me.arregloLibros.forEach((tr, index) => {
                            this.$set(this.valorDespacho, index, Math.max(tr.pro_deposito, 0));
                        });
                    } else if (this.acta.empresa == 3) {
                        me.arregloLibros.forEach((tr, index) => {
                            this.$set(this.valorDespacho, index, Math.max(tr.pro_depositoCalmed, 0));
                        });
                    }
                    // Verificar si hay cantidades pendientes
                    let pendiente = false;
                    for (let item of me.arregloLibros) {
                        if (item.p_libros_cantidad_pendiente !== 0) {
                            pendiente = true;
                            break;
                        }
                    }
                    // Si no hay cantidades pendientes, mostrar el mensaje y cerrar el popup
                    if (!pendiente) {
                        me.popupActa = false;
                        me.$vs.notify({
                            text: 'No hay cantidades pendientes',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                })
        },
        getCodigoActa(idempresa) {
            let me = this
            this.acta.codigoPedidoLibrosActa = '';
            // console.log('empresa:',idempresa)
            let letra, secuencia, nombrePeriodo, empresa;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            const iniciales = usuarioObjeto.iniciales
            const primeraLetraNombre = usuarioObjeto.nombres.charAt(0);
            const primeraLetraApellido = usuarioObjeto.apellidos.charAt(0);
            const periodoPedido = this.sendPedido.codigo_contrato;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'getCodigoActa?descuento=' + this.porcentaje_descuento + '&empresa=' + idempresa)
                .then(res => {
                    this.codigoActa = res.data
                    letra = this.codigoActa[0]
                    if (idempresa == 1) {
                        empresa = 'P'
                    } else if (idempresa == 3) {
                        empresa = 'C'
                    }
                    secuencia = this.codigoActa[1]
                    this.idDato = this.codigoActa[2]
                    nombrePeriodo = periodoPedido
                    this.acta.codigoPedidoLibrosActa = letra + '-' + empresa + '-' + nombrePeriodo + '-' + iniciales + '-' + secuencia
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    this.popupActa = false;
                    me.$vs.notify({
                        text: 'Error con el codigo de acta.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    me.$vs.loading.close()
                })
        },
        verificarIniciales(tr) {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if (!usuarioObjeto.iniciales) {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Error`,
                    // acceptText: 'Aceptar',
                    cancelText: 'Cancelar',
                    text: 'Usuario sin iniciales, no puede generar ACTA. Comuniquese con el equipo de soporte.',
                    // accept: this.aceptarLibrosObsequios
                })
                return
            } else {
                if (this.sendPedido.contrato_generado == null) {
                    me.$vs.notify({
                        text: 'No se puede aceptar, el pedido general no cuenta con un contrato.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                } else {
                    this.abrirguardarActa(tr)
                }
            }
        },
        abrirguardarActa(tr) {
            let me = this;
            let idPedido = tr.id_pedido
            let idPedidoObsequio = tr.id
            this.porcentaje_descuento = tr.porcentaje_descuento
            this.OtherClient = false
            this.popupActa = true
            this.permitirStock = false
            this.valorDespacho = []
            this.getLibrosObsequiosActa(tr.id)
            // me.getCodigoActa(me.porcentaje_descuento)
            // me.getLibrosActa(idPedidoObsequio)
            me.getEmpresas()
            me.getbeneficiario(idPedido);
            this.acta.empresa = ''
            this.acta.beneficiario = ''
            this.acta.observacion = ''
            this.estadoP = tr.estado_libros_obsequios
            this.datoidAprobador = tr.usuario_aprobacion_id
            this.datonombreAprobador = tr.usuario_aprobacion
            console.log(this.estadoP)
        },
        getOtherUsers(institucion) {
            let me = this
            this.$vs.loading();
            this.$http.get(this.$server_url + 'get_usuarios_institucion?institucion=' + institucion)
                .then(res => {
                    let datos = res.data
                    if (datos.length > 0) {
                        me.arregloOtherUsers = datos;
                    } else {
                        me.arregloOtherUsers = [];
                    }
                    this.$vs.loading.close();

                    this.combinarBeneficiariosConOtrosUsuarios();

                })
                .catch(function (error) {
                    console.log(error + 'error');
                    me.$vs.loading.close()
                })
        },

        // Función que combina los beneficiarios con los otros usuarios
        combinarBeneficiariosConOtrosUsuarios() {
            this.arregloBeneficiario.forEach(beneficiario => {
                // Buscamos si hay un usuario correspondiente en arregloOtherUsers
                let otherUser = this.arregloOtherUsers.find(user => user.ven_cliente.toString() === beneficiario.id_usuario.toString());

                if (otherUser) {
                    // Si encontramos un usuario correspondiente, actualizamos los datos en el beneficiario
                    beneficiario.cedula = otherUser.ruc_cliente; // Actualizamos la cédula con el RUC
                    beneficiario.fullLabel = `${otherUser.nombre} (${otherUser.ruc_cliente})`; // Actualizamos el fullLabel con el nombre y RUC
                }
            });

            // Ahora agregamos los usuarios de arregloOtherUsers que no han sido combinados
            this.arregloOtherUsers.forEach(user => {
                // Verificamos si el ven_cliente no existe en arregloBeneficiario
                let matchingBeneficiario = this.arregloBeneficiario.find(beneficiario => beneficiario.id_usuario.toString() === user.ven_cliente.toString());

                if (!matchingBeneficiario) {
                    // Si no hay coincidencia, los agregamos a arregloBeneficiario
                    this.arregloBeneficiario.push({
                        id_usuario: user.ven_cliente, // id_usuario es igual a ven_cliente
                        cedula: user.ruc_cliente, // Cedula será igual al ruc_cliente
                        fullLabel: `${user.nombre} (${user.ruc_cliente})`, // fullLabel es nombre + ruc_cliente
                    });
                }
            });

            console.log(this.arregloBeneficiario); // Para verificar los datos combinados y añadidos
        },

        getbeneficiario(idPedido) {
            let me = this
            this.$vs.loading();
            this.$http.get(this.$server_url + 'get_beneficiarios_pedidos/' + idPedido)
                .then(res => {
                    let datos = res.data
                    me.arregloBeneficiario = datos
                    this.arregloBeneficiario.map(beneficiario => {
                        beneficiario.fullLabel = `${beneficiario.nombres_beneficiario} (${beneficiario.cedula})`; // Concatenamos el nombre con la cédula
                    });
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        validarYGuardarActa() {
            let me = this;

            // Verificar si hay errores
            if (me.totalesDocumento.tieneErrores) {
                me.$vs.notify({
                    text: `No se puede guardar. Hay ${me.totalesDocumento.errores.length} error(es) que deben corregirse.`,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 5000
                });
                return;
            }

            // Verificar items pendientes (sin cantidad o con aprobación parcial)
            if (me.totalesDocumento.itemsPendientes > 0 && !me.generarConPendientes) {
                me.$vs.notify({
                    text: `Hay ${me.totalesDocumento.itemsPendientes} item(s) que quedarán pendientes. Active el switch "Generar con pendientes" para continuar.`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-info',
                    time: 5000
                });
                return;
            }

            // Confirmación adicional si hay items pendientes (generar con pendientes)
            if (me.totalesDocumento.itemsPendientes > 0 && me.generarConPendientes) {
                me.$vs.dialog({
                    type: 'confirm',
                    color: 'warning',
                    title: 'Confirmar generación con pendientes',
                    text: `Se generará el acta con ${me.totalesDocumento.itemsConCantidad} de ${me.arregloLibros.length} items.\n\n${me.totalesDocumento.itemsPendientes} item(s) quedarán en ESTADO PENDIENTE para posterior procesamiento.\n\n¿Desea continuar?`,
                    acceptText: 'Sí, generar con pendientes',
                    cancelText: 'Cancelar',
                    accept: () => me.guardarActa()
                });
                return;
            }

            // Si no hay errores ni items sin cantidad, guardar directamente
            me.guardarActa();
        },
        guardarActa() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);

            // Validación 1: Empresa
            if (!me.acta.empresa) {
                me.$vs.notify({
                    text: 'Falta la selección de Empresa.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            // Validación 2: Beneficiario
            if (!me.acta.beneficiario) {
                console.log(me.acta.beneficiario, 'xd');
                me.$vs.notify({
                    text: 'Falta el cliente.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            // Validación 3: Cédula
            if (!me.acta.ci) {
                console.log(me.acta.ci, 'xd');
                me.$vs.notify({
                    text: 'Falta el cedula cliente.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            let valor_total_aprobacion = 0;
            let valor_Descuento = 0;
            console.log(me.porcentaje_descuento);

            // Construir arreglo de libros con cantidades aprobadas
            let nuevoArregloLibros = me.arregloLibros.map((libro, index) => {
                let cantidad_aprobada = 0;

                if (this.acta.empresa === 1) {
                    cantidad_aprobada = me.permitirStock && (libro.p_libros_cantidad_pendiente > (this.switch_activar_todo_stock == true ? libro.totalStock : libro.pro_deposito))
                        ? me.valorDespacho[index]
                        : libro.p_libros_cantidad_pendiente;
                } else if (this.acta.empresa === 3) {
                    cantidad_aprobada = me.permitirStock && (libro.p_libros_cantidad_pendiente > (this.switch_activar_todo_stock == true ? libro.totalStock : libro.pro_depositoCalmed))
                        ? me.valorDespacho[index]
                        : libro.p_libros_cantidad_pendiente;
                }

                let cantidadPendiente = libro.p_libros_cantidad_pendiente - cantidad_aprobada;
                if (cantidadPendiente < 0) {
                    cantidadPendiente = 0;
                }

                return {
                    ...libro,
                    p_libros_cantidad_aprobada: cantidad_aprobada,
                    p_libros_cantidad_pendiente: cantidadPendiente
                };
            });

            // Filtrar solo los libros con cantidad aprobada mayor a 0
            nuevoArregloLibros = nuevoArregloLibros.filter(libro => libro.p_libros_cantidad_aprobada > 0);

            // Validación 4: Debe haber al menos un ítem con cantidad aprobada
            if (nuevoArregloLibros.length === 0) {
                me.$vs.notify({
                    text: 'Debe tener al menos un ítem con cantidad aprobada mayor a 0.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            // CALCULAR TOTALES DESPUÉS DE FILTRAR (con cantidades aprobadas)
            nuevoArregloLibros.forEach(libro => {
                valor_total_aprobacion += libro.p_libros_valor_u * libro.p_libros_cantidad_aprobada;
            });

            // Calcular descuento sobre el total aprobado
            valor_Descuento = parseFloat((valor_total_aprobacion * me.porcentaje_descuento) / 100).toFixed(2);

            console.log('valor_total_aprobacion:', valor_total_aprobacion);
            console.log('valor_Descuento:', valor_Descuento);
            console.log('Items aprobados:', nuevoArregloLibros);

            // Validación 5: Verificar stock disponible según empresa
            if (me.acta.empresa == 1 || me.acta.empresa == 6) {
                if (me.permitirStock) {
                    if (nuevoArregloLibros.some(libro => libro.p_libros_cantidad_aprobada > (this.switch_activar_todo_stock == true ? libro.totalStock : libro.pro_deposito))) {
                        me.$vs.notify({
                            text: 'La cantidad de libros en el pedido supera el stock disponible.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    } else if (nuevoArregloLibros.some(valor => valor.p_libros_cantidad_aprobada === undefined || valor.p_libros_cantidad_aprobada === null || valor.p_libros_cantidad_aprobada === '')) {
                        me.$vs.notify({
                            text: 'Error en la cantidad a despachar.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    } else if (!nuevoArregloLibros.some(valor => parseFloat(valor.p_libros_cantidad_aprobada) > 0)) {
                        me.$vs.notify({
                            text: 'Debe ingresar al menos una cantidad aprobada mayor que 0.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }
                } else {
                    if (me.arregloLibros.some(libro => libro.p_libros_cantidad_pendiente > (this.switch_activar_todo_stock == true ? libro.totalStock : libro.pro_deposito))) {
                        me.$vs.notify({
                            text: 'La cantidad de libros en el pedido supera el stock disponible.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }
                }
            } else if (me.acta.empresa == 3) {
                if (me.permitirStock) {
                    if (nuevoArregloLibros.some(libro => libro.p_libros_cantidad_aprobada > (this.switch_activar_todo_stock == true ? libro.totalStock : libro.pro_depositoCalmed))) {
                        me.$vs.notify({
                            text: 'La cantidad de libros en el pedido supera el stock disponible.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    } else if (nuevoArregloLibros.some(valor => valor.p_libros_cantidad_aprobada === undefined || valor.p_libros_cantidad_aprobada === null || valor.p_libros_cantidad_aprobada === '')) {
                        me.$vs.notify({
                            text: 'Error en la cantidad a despachar.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    } else if (!nuevoArregloLibros.some(valor => parseFloat(valor.p_libros_cantidad_aprobada) > 0)) {
                        me.$vs.notify({
                            text: 'Debe ingresar al menos una cantidad aprobada mayor que 0.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }
                } else {
                    if (me.arregloLibros.some(libro => libro.p_libros_cantidad_pendiente > (this.switch_activar_todo_stock == true ? libro.totalStock : libro.pro_depositoCalmed))) {
                        me.$vs.notify({
                            text: 'La cantidad de libros en el pedido supera el stock disponible.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }
                }
            }

            // Validación 6: Observación
            if (!me.acta.observacion) {
                me.$vs.notify({
                    text: 'Falta la observación.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            // Validación 7: Código de acta
            if (!me.acta.codigoPedidoLibrosActa) {
                me.$vs.notify({
                    text: 'Error codigo de documento.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            // Preparar FormData para enviar al backend
            let formData = new FormData();
            formData.append("ven_codigo", me.acta.codigoPedidoLibrosActa);
            formData.append("tip_ven_codigo", me.tipo_venta);
            formData.append("ven_observacion", me.acta.observacion);
            formData.append("id_empresa", me.acta.empresa);
            formData.append('periodo_id', me.sendPedido.id_periodo);
            formData.append('institucion_id', me.institucion);
            formData.append('user_created', me.usuario.idusuario);
            formData.append('id_dato', me.codigoActa[2]);
            formData.append('secuencia', me.codigoActa[1]);
            formData.append('id_pedidoLibrosObsequios', me.acta.id_pedido_librosObsequios);
            formData.append('pendiente', (me.permitirStock || me.generarConPendientes) ? 'si' : 'no');
            formData.append('cliente_beneficiario', me.acta.beneficiario);
            formData.append('valor_total', valor_total_aprobacion);
            formData.append('ven_desc_por', me.porcentaje_descuento);
            formData.append('ven_descuento', valor_Descuento);
            formData.append('ruc_cliente', me.acta.ci);
            formData.append('switch_activar_todo_stock', me.switch_activar_todo_stock);

            if (me.estadoP !== 4) {
                formData.append('usuario_aprobacion_id', usuarioObjeto.idusuario);
                formData.append('usuario_aprobacion', usuarioObjeto.nombres + ' ' + usuarioObjeto.apellidos);
            } else {
                formData.append('usuario_aprobacion_id', me.datoidAprobador);
                formData.append('usuario_aprobacion', me.datonombreAprobador);
            }
            formData.append("datos_detalle_venta", JSON.stringify(nuevoArregloLibros));

            // Guardar datos para posible reintento después de actualizar stock
            me.DatosAprobar = me.acta;

            me.$vs.loading();
            this.$http.post(this.$server_url + 'Acta_LibrosObsequios_Registrar_modificar', formData)
                .then(function (res) {
                    me.$vs.loading.close();

                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    } else if (res.data.status == 3) {
                        // Stock insuficiente - mostrar popup con errores
                        console.log("Stock insuficiente detectado");
                        me.erroresStock_Lista = res.data;
                        me.popupActivoErrorStock = true;
                    } else {
                        // Éxito
                        me.$vs.notify({
                            text: 'Se guardó correctamente',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-check-circle'
                        });
                        me.popupActa = false;
                        me.porcentaje_descuento = '';
                        me.datoidAprobador = '';
                        me.datonombreAprobador = '';
                        me.reset_Switchs();
                        me.getLibrosObsequios(0);
                        me.estadoP = '';
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: error.response && error.response.data && error.response.data.message
                            ? error.response.data.message
                            : 'Error al guardar el acta',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    me.estadoP = '';
                    me.datoidAprobador = '';
                    me.datonombreAprobador = '';
                });
        },
        changeHandleErrorStock(e) {
            let me = this;
            if (e.verificacionemitdeerrorlistado == 2) {
                // Actualizar stock - Recargar datos
                me.popupActivoErrorStock = false;
                me.$vs.loading();

                // Regenerar código de acta
                me.acta.codigoPedidoLibrosActa = '';
                me.getCodigoActa(me.acta.empresa);

                // Recargar libros con stock actualizado
                me.getLibrosActa(me.DatosAprobar.id_pedido_librosObsequios);

                me.$vs.loading.close();
                me.$vs.notify({
                    text: 'Stock actualizado. Verifique las cantidades disponibles y vuelva a intentar.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle',
                    time: 5000
                });

                console.log("Stock actualizado desde el servidor.");
            } else {
                // Cancelar - cerrar popup sin actualizar
                me.popupActivoErrorStock = false;
                console.log("Popup de errores cerrado sin actualizar.");
            }
        },
        reset_Switchs() {
            let me = this;
            me.switch_activar_todo_stock = false;
            me.permitirStock = false;
            me.generarConPendientes = false;
        },
    }
}
</script>


<style scoped>
.popopPadre {
    z-index: 51008;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}

.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>

<style>
/* Z-index para dialogs de confirmación - deben estar por encima del popup de ListadoPedidosObsequios */
.vs-dialog {
    z-index: 52000 !important;
}

.vs-dialog-dark {
    z-index: 51999 !important;
}
</style>
