<template>
    <div>
        <!-- Botones de acción -->
        <div align="center" class="no-print mb-4" v-if="Venta.idtipodoc != 12">
            <vs-button @click="handleImprimir" icon="print" color="primary" >
                Imprimir
            </vs-button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
            <div class="loading-spinner mb-4">
                <div class="spinner"></div>
            </div>
            <p class="text-gray-600 text-lg">Cargando detalles del documento...</p>
        </div>

        <!-- Contenido del PDF -->
        <div v-else id="seccionImprimir2" class="contenido-impresion">
            <!-- TIPO DOCUMENTO 1: Pre Factura -->
            <div v-if="Venta.idtipodoc == 1" style="width: 100%;">
                <vx-card style="width: 100%; padding: 8px; box-sizing: border-box;">
                    <!-- Título de la empresa -->
                    <p style="text-align: center; font-weight: bold; margin-bottom: 5px; font-size: 12px;">{{nombreEmpresaActual}}</p>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                      <span v-if="Venta.ven_tipo_inst=='V'" style="margin-top: 4px; font-size: 9px;">Directa</span>
                      <span v-else style="margin-top: 4px; font-size: 9px;">Por Lista</span>
                    </div>
                    <!-- Información de la venta -->
                    <table style="width: 100%; font-size: 10px;">
                        <thead>
                            <tr>
                                <td style="text-align: left; vertical-align: middle; padding: 5px;">
                                    <!-- Imagen de la empresa -->
                                    <span v-if="Venta.id_empresa == 3 || Venta.id_empresa == 4">
                                        <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png" style="width: 70px;">
                                    </span>
                                    <span v-if="Venta.id_empresa == 1 || Venta.id_empresa == 5">
                                        <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png" style="width: 100px;">
                                    </span>
                                </td>
                                <td>
                                    <div style="text-align: left;">
                                        <b style="color: black; font-weight: bold;">COMPROBANTE DE TRANSACCIÓN</b>
                                    </div>
                                </td>
                                <td colspan="3" style="text-align: center; vertical-align: middle; padding: 5px;">
                                    <div style="display: flex;justify-content: center;">
                                        <div style="margin-left: 20px;">
                                             <div style="display: flex; flex-direction: column; align-items: center;">
                                                <b>{{ Venta.ven_codigo }}</b>
                                            </div>
                                            <div class="vx-row" v-if="Venta.ven_codigo && groupBodega">
                                                <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-3">
                                                    <barcodeReutilizableVue :barcodeValue="Venta.ven_codigo" :width="0.6" :height="15" :barcodeId="'barcode-factura'" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style="text-align: center; vertical-align: middle; padding: 5px;" v-if="Venta.pedido_codigo">
                                     <div style="display: flex; flex-direction: column; align-items: center;">
                                        <span>{{ Venta.pedido_codigo }}</span>
                                    </div>
                                    <div class="vx-row" v-if="groupBodega">
                                        <barcodeReutilizableVue :barcodeValue="Venta.pedido_codigo" :width="0.7" :height="20" :barcodeId="'barcode-pedido'" />
                                    </div>
                                </td>
                            </tr>

                            <!-- Información del cliente y la venta -->
                            <tr>
                                <td v-if="Venta.ven_tipo_inst=='V'"><b>Institución: </b></td>
                                <td v-if="Venta.ven_tipo_inst=='L'"><b>Librería: </b></td>
                                <td colspan="4">{{Venta.institucion_nombre}}</td>
                            </tr>
                            <tr>
                                <td><b>Cliente: </b></td>
                                <td>{{Venta.cliente_nombre}}</td>
                                <td></td>
                                <td><b>RUC: </b></td>
                                <td>{{Venta.institucion_ruc}}</td>
                            </tr>
                            <tr>
                                <td><b>Fecha: </b></td>
                                <td>{{formatearFecha(Venta.ven_fecha)}}</td>
                                <td></td>
                                <td><b>Correo: </b></td>
                                <td>{{Venta.cliente_email}}</td>
                            </tr>
                            <tr>
                                <td><b>Dirección: </b></td>
                                <td>{{Venta.institucion_direccion}}</td>
                                <td width="30"></td>
                                <td><b>Teléfono: </b></td>
                                <td>{{Venta.institucion_telefono}}</td>
                            </tr>

                            <tr>
                                <td><b>Facturado por: </b></td>
                                <td>{{Venta.creado_por}}</td>
                                <td width="30"></td>
                                <td width="30"></td>
                            </tr>

                            <!-- Información de Pre-Proforma y responsable -->
                            <tr>
                                <template v-if="Venta.prof_id && groupBodega">
                                    <td><b>Pre-Proforma: </b></td>
                                    <td style="display: flex; flex-direction: column; align-items: center;">
                                        <span>{{Venta.prof_id}}</span>
                                        <barcodeReutilizableVue :barcodeValue="Venta.prof_id" :width="0.6" :height="15" :barcodeId="'barcode-proforma'" />
                                    </td>
                                </template>
                                <td></td>
                                <!-- <td><b>Facturado por: </b></td>
                                <td>{{Venta.creado_por}}</td> -->
                            </tr>
                        </thead>
                    </table>

                    <!-- Detalle de los productos de la venta -->
                    <table class="table tabla2 mi-clase-de-tabla" style="width: 100%; border-collapse: collapse; border: none; text-align: start; margin-top: 8px; font-size: 9px;">
                        <thead align="center">
                            <tr>
                                <th width="60" style="padding: 2px;">Cantidad</th>
                                <th width="20" style="padding: 2px;">Código</th>
                                <th width="250" style="padding: 2px;">Detalle</th>
                                <th width="60" style="padding: 2px;" v-if="usaDescuentoPorItemEnReporte()">Descuento%</th>
                                <th width="80" style="padding: 2px;">Valor Unitario</th>
                                <th width="80" style="padding: 2px;">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(detalle, k) in DetalleVenta" :key="k">
                                <td>{{ detalle.det_ven_cantidad }}</td>
                                <td style="padding: 1px;">{{ detalle.pro_codigo }}</td>
                                <td style="padding: 1px;">
                                    {{ detalle.descripcion }}
                                    <br />
                                    <small v-if="detalle.id_serie == 19"><b>Descripción </b>{{ detalle.descripcion_combo }}</small>
                                </td>
                                <td align="center" style="padding: 1px;" v-if="usaDescuentoPorItemEnReporte()">{{ parseFloat(detalle.descuento || 0).toFixed(2) }}</td>
                                <td align="center" style="padding: 1px;">{{ parseFloat(detalle.det_ven_valor_u).toFixed(2) }}</td>
                                <td style="text-align: right; padding: 1px;">{{ (parseFloat(detalle.det_ven_cantidad) * parseFloat(detalle.det_ven_valor_u)).toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>TOTAL: <b>{{ calcularTotalLibros() }}</b></b></td>
                                <!-- <td align="center" style="padding: 1px;"><b>{{ calcularTotalLibros() }}</b></td> -->
                                <td style="padding: 1px;" :colspan="usaDescuentoPorItemEnReporte() ? 4 : 3"></td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Resumen de valores -->
                    <table class="table tabla2 mi-clase-de-tabla" style="font-size: 9px; border-collapse: collapse; border: none; text-align: start; margin-top: 8px;">
                        <tbody>
                            <tr>
                                <td colspan="4" rowspan="6" align="left" width="300" style="padding: 3px;">
                                    <div>
                                        <b>Observación:</b> {{Venta.ven_observacion || 'Sin observaciones'}}<br />
                                        <b>Nota: </b> SOLO SE ACEPTARAN RECLAMOS DENTRO DE LOS 4 DÍAS POSTERIORES AL DESPACHO
                                    </div>
                                </td>
                                <td style="padding: 1px;"><b>Subtotal $:</b></td>
                                <td style="text-align: right; padding: 1px;" width="80"><b>{{ calcularSubtotal() }}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Descuento {{ !usaDescuentoPorItemEnReporte()?parseInt(calcularPorcentajeDescuento()): '' }} % $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>{{ calcularDescuento() }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Subtotal - Descuento $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>{{ calcularSubtotalConDescuento() }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>IVA $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>0.00</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Transporte $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>{{ parseFloat(Venta.ven_transporte || 0).toFixed(2) }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>TOTAL $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>{{ calcularTotal() }}</b>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </vx-card>
            </div>

            <!-- TIPO DOCUMENTO 2: Acta de Entrega -->
            <div v-if="Venta.idtipodoc == 2" style="width: 100%;">
                <vx-card style="width: 100%; padding: 8px;">
                    <p style="text-align: center; font-weight: bold; margin-bottom: 5px; font-size: 12px;">{{nombreEmpresaActual}}</p>
                    <h5 class="text-center font-bold" style="text-align: center; font-weight: bold; font-size: 14px; margin: 2px 0;">
                        PROMOCIÓN DE VENTAS</h5>
                    <h5 class="text-center font-bold" style="text-align: center; font-weight: bold; font-size: 14px; margin: 2px 0;">
                        ACTA DE ENTREGA
                    </h5>
                    
                    <table style="width: 100%; font-size: 10px;">
                        <thead>
                            <tr>
                                <td style="text-align: left; vertical-align: middle; padding: 5px;">
                                    <span v-if="Venta.id_empresa == 3 || Venta.id_empresa == 4">
                                        <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png" style="width: 70px;">
                                    </span>
                                    <span v-if="Venta.id_empresa == 1 || Venta.id_empresa == 5">
                                        <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png" style="width: 100px;">
                                    </span>
                                </td>

                                <td colspan="5" style="text-align: center; vertical-align: middle; padding: 5px;">

                                    <div style="display: flex;justify-content: center;">
                                        <div style="margin-left: 20px;">
                                             <div style="display: flex; flex-direction: column; align-items: center;">
                                                <b>{{ Venta.ven_codigo }}</b>
                                            </div>
                                            <div class="vx-row" v-if="Venta.ven_codigo && groupBodega">
                                                <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-3">
                                                    <barcodeReutilizableVue :barcodeValue="Venta.ven_codigo" :width="0.6" :height="15" :barcodeId="'barcode-factura'" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style="text-align: center; vertical-align: middle; padding: 5px;" v-if="Venta.pedido_codigo">
                                     <div style="display: flex; flex-direction: column; align-items: center;">
                                        <span>{{ Venta.pedido_codigo }}</span>
                                    </div>
                                    <div class="vx-row" v-if="groupBodega">
                                        <barcodeReutilizableVue :barcodeValue="Venta.pedido_codigo" :width="0.7" :height="20" :barcodeId="'barcode-pedido'" />
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td style="text-align: left; vertical-align: middle; padding: 5px;"><b>Institución: </b></td>
                                <td colspan="4">{{Venta.institucion_nombre}}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Cliente: </b></td>
                                <td style="padding: 5px;">{{Venta.cliente_nombre}}</td>
                                <td></td>
                                <td style="padding: 5px;"><b>RUC: </b></td>
                                <td style="padding: 5px;">{{Venta.institucion_ruc}}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Fecha: </b></td>
                                <td style="padding: 5px;">{{formatearFecha(Venta.ven_fecha)}}</td>
                                <td></td>
                                <td style="padding: 5px;"><b>Correo: </b></td>
                                <td style="padding: 5px;">{{Venta.cliente_email}}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Dirección: </b></td>
                                <td style="padding: 5px;">{{Venta.institucion_direccion}}</td>
                                <td width="30"></td>
                                <td style="padding: 5px;"><b>Teléfono: </b></td>
                                <td style="padding: 5px;">{{Venta.institucion_telefono}}</td>
                            </tr>

                            <tr>
                                <td style="padding: 5px;"><b>Facturado por: </b></td>
                                <td style="padding: 5px;">{{Venta.nombre_facturador}}</td>
                            </tr>

                            <tr>
                                <template v-if="Venta.prof_id && groupBodega">
                                    <td style="padding: 5px;"><b>Pre-Proforma: </b></td>
                                    <td style="display: flex; flex-direction: column; align-items: center; padding: 5px;">
                                        <span>{{Venta.prof_id}}</span>
                                        <barcodeReutilizableVue :barcodeValue="Venta.prof_id" :width="0.6" :height="15" :barcodeId="'barcode-proforma'" />
                                    </td>
                                </template>
                                <td></td>
                            </tr>
                        </thead>
                    </table>
                   
                    <br>
                    <p style="padding: 0px 30px 0px 0px; font-size: 9px; margin: 0;">
                        Con esta fecha, se procede a la suscripción de la presente Acta de
                        Entrega - Recepción de los productos que se otorgan en calidad de
                        <b>OBSEQUIOS SIN COSTO</b>, como parte de la PROMOCIÓN DE VENTAS.
                    </p>
                    <br>
                    <table class="tabla1" style="width: 100%; border-collapse: collapse; border: none; text-align: start; margin-top: 6px; font-size: 9px;">
                        <thead>
                            <tr>
                                <th style="padding: 2px; width: 100px;">Cantidad</th>
                                <th style="padding: 2px; width: 150px;">Código</th>
                                <th style="padding: 2px;">Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(detalle, k) in DetalleVenta" :key="k">
                                <td style="padding: 2px;">{{ detalle.det_ven_cantidad }}</td>
                                <td style="padding: 2px;">{{ detalle.pro_codigo }}</td>
                                <td style="padding: 2px;">
                                    {{ detalle.descripcion }}
                                    <br />
                                    <small v-if="detalle.id_serie == 19"><b>Descripción: </b>{{ detalle.descripcion_combo }}</small>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 2px;" colspan="3"><b>TOTAL: {{ calcularTotalLibros() }}</b></td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <div style="padding: 0px 30px 0px 0px; font-size: 9px; margin: 0;  margin-top: 8px;">
                        <p style="margin: 2px 0;">
                            <b>Observación Asesor:</b>
                            {{ Venta.observacion_pedido && Venta.observacion_pedido !== 'null' && Venta.observacion_pedido.trim() !== ''
                                ? Venta.observacion_pedido
                                : 'No hay observaciones' }}
                        </p>
                        <p style="margin: 2px 0;">
                            <b>Observación facturador:</b> {{ Venta.ven_observacion || 'No hay observaciones' }}
                        </p>
                        <!-- <p style="margin: 2px 0;">
                            <b>Por:</b> {{ Venta.nombre_facturador }}
                        </p> -->
                    </div>
                    <br>
                    <div>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                            <tr>
                                <td style="text-align: center; padding: 10px; font-size: 9px;">
                                    _____________________<br>
                                    <b>FIRMA CLIENTE</b>
                                </td>
                                <td style="text-align: center; padding: 10px; font-size: 9px;">
                                    _____________________<br>
                                    <b>FIRMA AUTORIZADA</b>
                                </td>
                            </tr>
                        </table>
                    </div>
                </vx-card>
            </div>

            <!-- TIPO DOCUMENTO 12: Acta de Entrega Simplificada -->
            <div v-if="Venta.idtipodoc == 12" style="width: 100%;">
                <GuiasPrintDocumentoVenta 
                    ref="guiasPrint"
                    :modulo_despachos="Number(1)"
                    :objectedDocumentoVenta="{
                        id_pedido_guia: Venta.id_pedido_guia,
                        ven_codigo: Venta.ven_codigo
                    }"
                    @estadoCambiado="$emit('estadoCambiado')"
                />
            </div>

            <!-- TIPO DOCUMENTO 3 y 4: Nota de Entrega -->
            <div v-if="Venta.idtipodoc == 3 || Venta.idtipodoc == 4" style="width: 100%;">
                <vx-card style="width: 100%; padding: 8px;">
                     <!-- Título de la empresa -->
                    <p style="text-align: center; font-weight: bold; margin-bottom: 5px; font-size: 12px;">{{nombreEmpresaActual}}</p>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                      <span v-if="Venta.ven_tipo_inst=='V'" style="margin-top: 4px; font-size: 9px;">Directa</span>
                      <span v-else style="margin-top: 4px; font-size: 9px;">Por Lista</span>
                    </div>
                    
                    <table style="width: 100%; font-size: 10px;">
                        <thead>
                            <tr>
                               <td style="text-align: left; vertical-align: middle; padding: 5px;">
                                    <!-- Imagen de la empresa -->
                                    <span v-if="Venta.id_empresa == 3 || Venta.id_empresa == 4">
                                        <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png" style="width: 70px;">
                                    </span>
                                    <span v-if="Venta.id_empresa == 1 || Venta.id_empresa == 5">
                                        <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png" style="width: 100px;">
                                    </span>
                                </td>
                                <td>
                                    <div style="text-align: left;">
                                        <b style="color: black;">NOTA DE ENTREGA</b>
                                    </div>
                                </td>
                                <td colspan="3" style="text-align: center; vertical-align: middle; padding: 5px;">
                                    <div style="display: flex;justify-content: center;">
                                        <div style="margin-left: 20px;">
                                             <div style="display: flex; flex-direction: column; align-items: center;">
                                                <b>{{ Venta.ven_codigo }}</b>
                                            </div>
                                            <div class="vx-row" v-if="Venta.ven_codigo && groupBodega">
                                                <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-3">
                                                    <barcodeReutilizableVue :barcodeValue="Venta.ven_codigo" :width="0.6" :height="15" :barcodeId="'barcode-factura'" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td style="text-align: center; vertical-align: middle; padding: 5px;" v-if="Venta.pedido_codigo">
                                     <div style="display: flex; flex-direction: column; align-items: center;">
                                        <span>{{ Venta.pedido_codigo }}</span>
                                    </div>
                                    <div class="vx-row" v-if="groupBodega">
                                        <barcodeReutilizableVue :barcodeValue="Venta.pedido_codigo" :width="0.7" :height="20" :barcodeId="'barcode-pedido'" />
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 5px;" v-if="Venta.ven_tipo_inst == 'V'"><b>Institución:</b></td>
                                <td style="padding: 5px;" v-if="Venta.ven_tipo_inst == 'L'"><b>Librería:</b></td>
                                <td colspan="4">{{Venta.institucion_nombre}}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Cliente: </b></td>
                                <td style="padding: 5px;">{{Venta.cliente_nombre}}</td>
                                <td></td>
                                <td style="padding: 5px;"><b>RUC: </b></td>
                                <td style="padding: 5px;">{{Venta.institucion_ruc}}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Fecha: </b></td>
                                <td style="padding: 5px;">{{formatearFecha(Venta.ven_fecha)}}</td>
                                <td></td>
                                <td style="padding: 5px;"><b>Correo: </b></td>
                                <td style="padding: 5px;">{{Venta.cliente_email}}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Dirección: </b></td>
                                <td style="padding: 5px;">{{Venta.institucion_direccion}}</td>
                                <td width="30"></td>
                                <td style="padding: 5px;"><b>Teléfono: </b></td>
                                <td style="padding: 5px;">{{Venta.institucion_telefono}}</td>
                            </tr>

                            <tr>
                                <td style="padding: 5px;">
                                    <b v-if="Venta.ven_tipo_inst == 'L'">Facturador:</b>
                                    <b v-if="Venta.ven_tipo_inst == 'V'">Cód. promotor/Vendedor:</b>
                                </td>
                               
                                <td style="padding: 5px;">{{Venta.creado_por}}</td>
                            </tr>

                            <tr>
                                <template v-if="Venta.prof_id && groupBodega">
                                    <td style="padding: 5px;"><b>Pre-Proforma: </b></td>
                                    <td style="display: flex; flex-direction: column; align-items: center; padding: 5px;">
                                        <span>{{Venta.prof_id}}</span>
                                        <barcodeReutilizableVue :barcodeValue="Venta.prof_id" :width="0.6" :height="15" :barcodeId="'barcode-proforma'" />
                                    </td>
                                </template>
                                <td></td>
                            </tr>
                        </thead>
                    </table>

                    <table class="tabla1" style="width: 100%; border-collapse: collapse; border: none; text-align: start; margin-top: 6px; font-size: 9px;">
                        <thead>
                            <tr>
                                <th>Cantidad</th>
                                <th>Código</th>
                                <th>Detalle</th>
                                <th v-if="usaDescuentoPorItemEnReporte()">Descuento%</th>
                                <th>Valor Unitario</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(detalle, k) in DetalleVenta" :key="k">
                                <td>{{ detalle.det_ven_cantidad }}</td>
                                <td>{{ detalle.pro_codigo }}</td>
                                <td>
                                    {{ detalle.descripcion }}
                                    <br />
                                    <small v-if="detalle.id_serie == 19"><b>Descripción: </b>{{ detalle.descripcion_combo }}</small>
                                </td>
                                <td v-if="usaDescuentoPorItemEnReporte()">{{ parseFloat(detalle.descuento || 0).toFixed(2) }}</td>
                                <td>${{ parseFloat(detalle.det_ven_valor_u).toFixed(2) }}</td>
                                <td>${{ (parseFloat(detalle.det_ven_cantidad || 0) * parseFloat(detalle.det_ven_valor_u || 0)).toFixed(2) }}</td>
                            </tr>
                            <td style="padding: 1px;"><b>TOTAL: <b>{{ calcularTotalLibros() }}</b></b></td>
                        </tbody>
                    </table>

                    <table class="tabla1" style="width: 100%; border-collapse: collapse; border: none; text-align: start; margin-top: 8px; font-size: 9px;">
                        <tbody>
                            <tr>
                                <td rowspan="6" align="left" style="padding: 2px;">
                                    <b>Observación:</b> {{ Venta.ven_observacion || 'Sin observaciones' }}
                                    <br><br>
                                    <b>Notas:</b> SOLO SE ACEPTARAN RECLAMOS DENTRO DE LOS 4 DÍAS POSTERIORES AL DESPACHO
                                </td>
                                <td style="padding: 1px;"><b>Total Libros:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>{{ calcularTotalLibros() }}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Suman $:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>{{ calcularSubtotal() }}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Desc. {{ !usaDescuentoPorItemEnReporte()?parseInt(calcularPorcentajeDescuento()): '' }} % $:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>{{ calcularDescuento() }}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Subtotal $:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>{{ calcularSubtotalConDescuento() }}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Transporte $:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>{{ parseFloat(Venta.ven_transporte || 0).toFixed(2) }}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>TOTAL $:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>{{ calcularTotal() }}</b></td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="margin-top: 90px;">
                        <div style="font-size: 9px; float: left; text-align: center; border-top: solid 1px black; margin-left: 45px; padding: 0px 15px;">
                            <b>Deudor / Recibí Conforme</b>
                        </div>
                        <div style="font-size: 9px; float: right; text-align: center; border-top: solid 1px black; margin-right: 45px; padding: 0px 20px;">
                            <b>Entregué Conforme</b>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import imprimirMixin from "@/mixins/Pedidosmix";
const barcodeReutilizableVue = () => import('@/views/pedidos2/pedidos/proforma/barcodeReutilizable.vue');
const GuiasPrintDocumentoVenta = () => import('@/views/pedidos/components/Guias/guiasFacturador/GuiasPrintDocumentoVenta.vue');

export default {
    mixins: [imprimirMixin],
    computed: {
        ...mapState(["AdminBodega","userBodegaNormal", 'groupFacturador', 'groupBodega']),
    },
    components: {
        barcodeReutilizableVue,
        GuiasPrintDocumentoVenta,
    },
    props: {
        venta: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            Venta: {},
            DetalleVenta: [],
            nombreEmpresaActual: '',
            usuario:[],
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.getEmpresaActual();
        this.getDetallesVenta();
    },
    methods: {
        async getEmpresaActual() {
            try {
                const res = await this.$http.get(this.$server_url + 'empresaActual');
                this.nombreEmpresaActual = res.data[0].descripcion_corta;
            } catch (err) {
                console.error('Error al cargar empresa actual:', err);
            }
        },

        getDetallesVenta() {
            let me = this;
            me.loading = true;

            // Asignar la venta recibida
            me.Venta = { ...me.venta };

            // Obtener los detalles de la venta usando la ruta correcta
            const url = `${me.$server_url}devoluciones?CargarDocumentosDetalles=yes&codigo=${me.venta.ven_codigo}&empresa=${me.venta.id_empresa}`;

            me.$http.get(url)
            .then(res => {
                me.loading = false;
                me.DetalleVenta = res.data.map(item => ({
                    pro_codigo: item.pro_codigo,
                    descripcion: item.pro_nombre || item.nombre_libro || item.nombre || item.descripcion || '',
                    descripcion_combo: item.descripcion_producto || '',
                    det_ven_cantidad: item.det_ven_cantidad,
                    det_ven_valor_u: item.det_ven_valor_u,
                    id_serie: item.id_serie || null,
                    descuento: item.descuento || 0
                }));
            })
            .catch((e) => {
                me.loading = false;
                console.error('Error al cargar detalles:', e);
                me.$vs.notify({
                    text: 'Error al cargar los detalles de la venta',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            });
        },

        calcularSubtotal() {
            const subtotal = this.DetalleVenta.reduce((total, item) => {
                return total + (parseFloat(item.det_ven_cantidad) * parseFloat(item.det_ven_valor_u));
            }, 0);
            return subtotal.toFixed(2);
        },

        calcularDescuento() {
            // Calcular el descuento por cada detalle de forma independiente
            const descuentoMonto = this.DetalleVenta.reduce((total, item) => {
                const subtotal_item = parseFloat(item.det_ven_cantidad) * parseFloat(item.det_ven_valor_u);
                const porcentaje_item = parseFloat(item.descuento || 0);
                return total + (subtotal_item * porcentaje_item / 100);
            }, 0);

            return descuentoMonto.toFixed(2);
        },

        usaDescuentoPorItemEnReporte() {
            const tipodoc = parseInt(this.Venta.idtipodoc);
            const aplicaTipoDocumento = tipodoc === 1 || tipodoc === 3 || tipodoc === 4;
            if (!aplicaTipoDocumento) {
                return false;
            }

            if (this.Venta.ven_desc_por === null || this.Venta.ven_desc_por === undefined) {
                return true;
            }

            if (String(this.Venta.ven_desc_por).toLowerCase() === 'null') {
                return true;
            }

            return false;
        },

        calcularPorcentajeDescuento() {
            if (this.usaDescuentoPorItemEnReporte()) {
                const subtotal = parseFloat(this.calcularSubtotal());
                const descuento = parseFloat(this.calcularDescuento());

                if (subtotal <= 0) {
                    return '0.00';
                }

                return ((descuento * 100) / subtotal).toFixed(2);
            }

            return parseFloat(this.Venta.ven_desc_por || 0).toFixed(2);
        },

        calcularSubtotalConDescuento() {
            const subtotal = parseFloat(this.calcularSubtotal());
            const descuento = parseFloat(this.calcularDescuento());
            return (subtotal - descuento).toFixed(2);
        },

        calcularIVA() {
            // IVA siempre 0 como solicitaste
            return '0.00';
        },

        calcularTotal() {
            const subtotalConDesc = parseFloat(this.calcularSubtotalConDescuento());
            const transporte = parseFloat(this.Venta.ven_transporte || 0);
            const total = subtotalConDesc + transporte;
            return total.toFixed(2);
        },

        calcularTotalLibros() {
            const total = this.DetalleVenta.reduce((sum, item) => {
                return sum + parseInt(item.det_ven_cantidad || 0);
            }, 0);
            return total;
        },

        formatearFecha(fecha) {
            if (!fecha) return '-';
            const date = new Date(fecha);
            return date.toLocaleDateString('es-EC', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }) + ' ' + date.toLocaleTimeString('es-EC', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        handleImprimir() {
          // Si es tipo documento 12, delegar la impresión al componente hijo
        //   if (this.Venta.idtipodoc == 12) {
        //       if (this.$refs.guiasPrint) {
        //           this.$refs.guiasPrint.handleImprimir();
        //       }
        //       return;
        //   }

          if(this.AdminBodega || this.userBodegaNormal){
            // Si está en estado Pendiente (2), cambiar a En Proceso (4) antes de imprimir
            if (this.Venta.est_ven_codigo == 2) {
                this.cambiarAEnProceso();
            } else {
                this.m_imprimirTodos('12px', this.Venta.ven_codigo);
            }
          }else{
            // Usuarios que no son de bodega solo pueden imprimir sin cambiar estado
            this.m_imprimirTodos('12px', this.Venta.ven_codigo);
          }

        },

        cambiarAEnProceso() {
            let me = this;
            me.$vs.loading();

             const datos = {
                ven_codigo: me.Venta.ven_codigo,
                empresa: me.Venta.id_empresa,
                usuario_id: me.usuario.idusuario
            };

            this.$http.post(this.$server_url + 'api/perseo/ventas/marcar-impreso', datos)
                .then(res => {
                    me.$vs.loading.close();

                    if (res.data && res.data.status == 0) {
                        me.$f_notificacion(res.data.message ? res.data.message : 'No se pudo cambiar a En proceso', 'danger', 'icon-x');
                        return;
                    }
                    if (res.data && res.data.status == 3) {
                        me.$f_notificacion(res.data.message ? res.data.message : 'No se pudo cambiar a En proceso', 'warning', 'icon-x');
                    }

                    // Actualizar el estado local
                    me.Venta.est_ven_codigo = 4;

                    me.$f_notificacion('Estado cambiado a En Proceso exitosamente', 'success', 'icon-check', 3000);

                    // Emitir evento para recargar el listado en el componente padre
                    me.$emit('estadoCambiado');
                    me.m_imprimirTodos('12px', me.Venta.ven_codigo);
                })
                .catch((err) => {
                    me.$vs.loading.close();
                    let mensaje = 'Error al cambiar a En proceso';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }
                    me.$f_notificacion(mensaje, 'danger', 'icon-x');
                });
        },


        cerrar() {
            this.$emit('cerrar');
        }
    }
}
</script>

<style>
/* Estilos globales para impresión - CORREGIDOS */
@media print {
    @page {
        margin: 0.5cm;
        size: A4;
    }

    /* Ocultar elementos que no se deben imprimir */
    .no-print {
        display: none !important;
    }

    /* Mostrar solo el contenido de impresión */
    body * {
        visibility: hidden;
    }

    #seccionImprimir2,
    #seccionImprimir2 * {
        visibility: visible;
    }

    #seccionImprimir2 {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: white !important;
        box-shadow: none !important;
        border: none !important;
    }

    /* Quitar estilos de visualización al imprimir */
    .contenido-impresion {
        background-color: white !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        border: none !important;
    }

    /* Asegurar que no haya cards o bordes */
    * {
        box-shadow: none !important;
        border-radius: 0 !important;
    }

    body {
        background-color: white !important;
    }

    /* Evitar saltos de página innecesarios - LÍNEA PROBLEMÁTICA ELIMINADA */
    table, tr, td, th {
        page-break-inside: avoid;
    }

    /* Mantener las tablas juntas */
    .tabla1, .tabla2 {
        page-break-inside: avoid;
    }
}
</style>

<style scoped>
/* Estilos para visualización en pantalla - COMPACTOS */
.contenido-impresion {
    background-color: white;
    padding: 8px;
    margin: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.tabla1,
.tabla2 {
    table-layout: auto;
    width: 95%;
    border-collapse: collapse;
    margin: 8px auto;
    font-size: 9px;
}

.tabla1 td,
.tabla2 td {
    padding: 1px;
    box-sizing: border-box;
}

.table-cell {
    border: 1px solid black;
}

/* Reducir fuentes en general */
table {
    font-size: 9px;
}

th {
    font-size: 9px;
    padding: 2px;
}

td {
    font-size: 9px;
    padding: 1px;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
