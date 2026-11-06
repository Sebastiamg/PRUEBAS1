<template>
<div>
    <div>
        <vs-button v-if="AdminBodega" @click="imprimir();m_imprimirTodos('12px',Venta.ven_codigo)">Imprimir</vs-button>
        <vs-button v-else @click="m_imprimirTodos('12px',Venta.ven_codigo)">Imprimir</vs-button>
    </div>
    <div id="seccionImprimir2">
        <div v-if="Venta.idtipodoc == 1" style="width: 100%;" >
            <vx-card style="width: 100%; padding: 20px; box-sizing: border-box;">
            <!-- Título de la empresa -->
            <p style="text-align: center; font-weight: bold; margin-bottom: 10px;">{{nombreEmpresaActual}}</p>

            <!-- Información de la venta -->
            <table style="width: 100%;">
                <thead>
                    <tr>
                        <td style="text-align: left; vertical-align: middle; padding: 10px;">
                            <!-- Imagen de la empresa -->
                            <span v-if="Venta.empresa_id == 3 || Venta.empresa_id == 4">
                                <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png" style="width: 100px;">
                            </span>
                            <span v-if="Venta.empresa_id == 1 || Venta.empresa_id == 5">
                                <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png" style="width: 150px;">
                            </span>
                        </td>

                        <td colspan="5" style="text-align: center; vertical-align: middle; padding: 10px;">
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <b>COMPROBANTE DE TRANSACCIÓN: {{Venta.ven_codigo}}</b>
                                <span v-if="Venta.ven_tipo_inst=='V'" style="margin-top: 8px;">Directa</span>
                                <span v-else style="margin-top: 8px;">Por Lista</span>
                            </div>
                            <div class="vx-row" v-if="Venta.ven_codigo && groupBodega">
                                <div class="vx-col w-full sm:w-full md:w-fulllg:w-fullxl:w-full mb-6">
                                    <barcodeReutilizableVue :barcodeValue="Venta.ven_codigo" :width="0.8" :height="20" :barcodeId="'barcode-factura'" />
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Información del cliente y la venta -->
                    <tr>
                        <td v-if="Venta.ven_tipo_inst=='V'"><b>Institución: </b></td>
                        <td v-if="Venta.ven_tipo_inst=='L'"><b>Librería: </b></td>
                        <td colspan="4">{{Venta.nombreInstitucion}}</td>
                    </tr>
                    <tr>
                        <td><b>Cliente: </b></td>
                        <td>{{Venta.cliente}}</td>
                        <td></td>
                        <td><b>RUC: </b></td>
                        <td>{{Venta.cedula}}</td>
                    </tr>
                    <tr>
                        <td><b>Fecha: </b></td>
                        <td>{{Venta.ven_fecha}}</td>
                        <td></td>
                        <td><b>Correo: </b></td>
                        <td>{{Venta.email}}</td>
                    </tr>
                    <tr>
                        <td><b>Dirección: </b></td>
                        <td>{{Venta.direccionInstitucion}}</td>
                        <td width="50"></td>
                        <td><b>Teléfono: </b></td>
                        <td>{{Venta.telefono}}</td>
                    </tr>

                    <!-- Información de Pre-Proforma y responsable -->
                    <tr>
                        <template v-if="Venta.ven_idproforma && groupBodega">
                            <td><b>Pre-Proforma: </b></td>
                            <td style="display: flex; flex-direction: column; align-items: center;">
                                <span>{{Venta.ven_idproforma}}</span>
                                <barcodeReutilizableVue :barcodeValue="Venta.ven_idproforma" :width="0.8" :height="20" :barcodeId="'barcode-proforma'" />
                            </td>
                        </template>
                        <td></td>
                        <td><b>Facturado por: </b></td>
                        <td>{{Venta.responsable}}</td>
                    </tr>
                </thead>
            </table>

            <!-- Detalle de los productos de la venta -->
            <table class="table tabla2 mi-clase-de-tabla" style="width: 100%; border-collapse: collapse; border: none; text-align: start; margin-top: 20px;">
                <thead align="center">
                    <tr>
                        <th width="25">Código</th>
                        <th width="100">Cantidad</th>
                        <th width="350">Descripción</th>
                        <th width="150">Valor Unitario</th>
                        <th width="100">Valor Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(detalle, k) in DetalleVenta" :key="k">
                        <td><b>{{ detalle.pro_codigo }}</b></td>
                        <td align="center">{{ detalle.det_ven_cantidad }}</td>
                        <td>{{ detalle.id_serie == '19' ? detalle.nombre + ' ' + detalle.descripcionlibro : detalle.nombre }}</td>
                        <td align="center">{{ detalle.det_ven_valor_u }}</td>
                        <td style="text-align: right;">{{ (parseFloat(detalle.det_ven_cantidad || 0) * parseFloat(detalle.det_ven_valor_u || 0)).toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Resumen de valores -->
            <table class="table tabla2 mi-clase-de-tabla" style="font-size: 11px; border-collapse: collapse; border: none; text-align: start; margin-top: 20px;">
                <tbody>
                    <tr>
                        <td colspan="4" rowspan="6" align="left" width="300">
                            <div>
                                <b>Observación:</b> {{Venta.ven_observacion ? Venta.ven_observacion : Venta.prof_observacion}}<br /><br />
                                <b>Nota: </b> SOLO SE ACEPTARAN RECLAMOS DENTRO DE LOS 4 DÍAS POSTERIORES AL DESPACHO
                            </div>
                        </td>
                        <td><b>Subtotal $:</b></td>
                        <td style="text-align: right;" width="100"><b>{{ parseFloat(Venta.ven_subtotal || 0).toFixed(2) }}</b></td>
                    </tr>
                    <tr>
                        <td><b>Descuento {{ Venta.ven_desc_por }} $:</b></td>
                        <td style="text-align: right;">
                            <b>{{ parseFloat((parseFloat(Venta.ven_subtotal || 0) * parseFloat(Venta.ven_desc_por || 0)) / 100).toFixed(2) }}</b>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Subtotal - Descuento $:</b></td>
                        <td style="text-align: right;">
                            <b>{{ (parseFloat(Venta.ven_subtotal || 0) - parseFloat(Venta.ven_descuento || 0)).toFixed(2) }}</b>
                        </td>
                    </tr>
                    <tr>
                        <td><b>IVA $:</b></td>
                        <td style="text-align: right;">
                            <b>{{ parseFloat(Venta.ven_iva || 0).toFixed(2) }}</b>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Transporte $:</b></td>
                        <td style="text-align: right;">
                            <b>{{ parseFloat(Venta.ven_transporte || 0).toFixed(2) }}</b>
                        </td>
                    </tr>
                    <tr>
                        <td><b>TOTAL $:</b></td>
                        <td style="text-align: right;">
                            <b>{{ parseFloat(Venta.ven_valor || 0).toFixed(2) }}</b>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Mensaje de documento de intercambio -->
            <p v-if="Venta.doc_intercambio" style="text-align: center; font-weight: bold; color: red; margin-top: 20px;">
                ESTE DOCUMENTO ESTÁ ASOCIADO A UN DOCUMENTO DE INTERCAMBIO, REF: {{Venta.doc_intercambio}}
            </p>
        </vx-card>

        </div>
        <div v-if="Venta.idtipodoc == 2" style="width: 100%;">
            <vx-card style="width: 100%;">
                <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
                <h5 class="text-center font-bold" style="text-align: center; font-weight: bold; font-size: 16px;">
                    PROMOCIÓN DE VENTAS</h5>
                <h5 class="text-center font-bold" style="text-align: center; font-weight: bold; font-size: 16px;margin-top: -7px;">
                    ACTA DE ENTREGA</h5>
                <h5 class="text-center font-bold mt-2" style="float:right; margin-right: 45px; text-align: center; font-weight: bold; font-size: 14px;">
                    {{ Venta.ven_codigo }}</h5>
                <p class="letra" style="padding: 0px 60px 0px 0px; font-size: 11px; margin: 0; margin-left: 35px;">
                    <b>Fecha:</b> {{ Venta.ven_fecha}}
                </p>
                <br>
                <table style="border: none; text-align: start; border-collapse: collapse; width:80%; margin-left: 35px">
                    <tr style="border: none;">
                        <td style="border: none; text-align: start; padding: 0; width: auto;">
                            <p style="font-size: 11px; margin: 0;">
                                <b>INSTITUCIÓN BENEFICIADA:</b>
                            </p>
                        </td>
                        <td style="border: none; text-align: left; padding: 0;" colspan="2">
                            <p style="font-size: 11px; margin: 0;">
                                {{ Venta.nombreInstitucion }}
                            </p>
                        </td>
                        <td style="border: none; text-align: start; padding: 0;"></td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border: none; text-align: start; padding: 0; width: auto;">
                            <p style="font-size: 11px; margin: 0;">
                                <b>CLIENTE:</b>
                            </p>
                        </td>
                        <td style="border: none; text-align: left; padding: 0;" colspan="2">
                            <p style="font-size: 11px; margin: 0;">
                                {{ Venta.cliente }}
                            </p>
                        </td>
                        <td style="border: none; text-align: start; padding: 0;"></td>
                        <td style="border: none; text-align: start; padding: 0;"></td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border: none; text-align: start; padding: 0; width: auto;">
                            <p style="font-size: 11px; margin: 0;">
                                <b>CI:</b>
                            </p>
                        </td>
                        <td style="border: none; text-align: left; padding: 0;">
                            <p style="font-size: 11px; margin: 0;">
                                {{ Venta.cedula }}
                            </p>
                        </td>
                        <td style="border: none; text-align: start; padding: 0; width: auto;">
                            <p style="font-size: 11px; margin: 0;">
                                <b>TELF:</b>
                            </p>
                        </td>
                        <td style="border: none; text-align: left; padding: 0;">
                            <p style="font-size: 11px; margin: 0;">
                                {{ Venta.telefono }}
                            </p>
                        </td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border: none; text-align: start; padding: 0; width: auto;">
                            <p style="font-size: 11px; margin: 0;">
                                <b>DIRECCIÓN:</b>
                            </p>
                        </td>
                        <td style="border: none; text-align: left; padding: 0;">
                            <p style="font-size: 11px; margin: 0;">
                                {{ Venta.direccionInstitucion }}
                            </p>
                        </td>
                        <td style="border: none; text-align: start; padding: 0;"></td>
                        <td style="border: none; text-align: start; padding: 0;"></td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border: none; text-align: start; padding: 0; width: auto;">
                            <p style="font-size: 11px; margin: 0;">
                                <b>RESPONSABLE:</b>
                            </p>
                        </td>
                        <td style="border: none; text-align: left; padding: 0;">
                            <p style="font-size: 11px; margin: 0;">
                                {{ Venta.asesor }}
                            </p>
                        </td>
                        <td style="border: none; text-align: start; padding: 0;"></td>
                        <td style="border: none; text-align: start; padding: 0;"></td>
                    </tr>
                </table>
                <br>
                <p style="padding: 0px 60px 0px 0px; font-size: 11px; margin: 0; margin-left: 35px;">
                    Con esta fecha, se procede a la suscripción de la presente Acta de
                    Entrega - Recepción de los productos que se otorgan en calidad de
                    <b>OBSEQUIOS SIN COSTO</b>, como parte de la PROMOCIÓN DE VENTAS.
                </p>
                <br>
                <table style="table-layout: fixed; width: 90%; border-collapse: collapse; border: none; font-size: 11px; margin-top: 15px; margin-left: 45px;">
                    <thead>
                        <tr>
                            <td colspan="1" style="width: 160px; border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;">
                                <b>CODIGO</b>
                            </td>
                            <td colspan="1" style=" border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;">
                                <b>LIBROS</b>
                            </td>
                            <td colspan="1" style="width: 160px; border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;">
                                <b>CANTIDAD</b>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(tr,key) in DetalleVenta" :key="key">
                            <td style=" border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0; padding-left: 10px;" >
                                {{ tr.pro_codigo }}
                            </td>
                            <td style="border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;text-align: left; padding-left: 10px;" v-if="tr.id_serie === 19">
                                {{ tr.nombre}} <br>
                                <b>Descripción Combo:</b> {{ tr.descripcionlibro }}
                            </td>
                            <td style=" border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;text-align: left; padding-left: 10px;" v-else>
                                {{ tr.nombre }}
                            </td>
                            <td style="border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;">
                                {{ tr.det_ven_cantidad }}</td>
                        </tr>
                    </tbody>
                </table>
                <br><br>
                <p style="padding: 0px 60px 0px 0px; font-size: 11px; margin: 0; margin-left: 35px; margin-top: 15px;"> <b>OBSERVACIÓN :</b> {{ Venta.ven_observacion }} </p>
                <br>
                <div>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr>
                            <td style="text-align: center; font-size: 11px; padding: 0 60px; border: none;">
                                <b>ENTREGUÉ CONFORME</b>
                            </td>
                            <td style="text-align: center; font-size: 11px; padding: 0 60px; border: none;">
                                <b>RECIBÍ CONFORME</b>
                            </td>
                        </tr>
                        <tr style="height: 50px; border: none;">
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <td style="text-align: center; font-size: 11px; padding: 0 60px; border: none;">
                                {{ Venta.empresa }} <br> <b>VENDEDOR</b>
                            </td>
                            <td style="text-align: center; font-size: 11px; padding: 0 60px; border: none; margin-right: 35px;">
                                {{ Venta.institucionNombre }} <br> <b>COMPRADOR</b>
                            </td>
                        </tr>
                    </table>
                </div>
                <br>
                <p style="padding: 0px 60px 0px 0px; font-size: 11px; margin: 0; margin-left: 35px; margin-top: 15px;">
                    <b>Elaborado por:</b> {{ Venta.responsable }}
                </p>
            </vx-card>
        </div>
        <div v-if="Venta.idtipodoc == 3 || Venta.idtipodoc == 4" style="width: 100%;">
            <vx-card style="width: 100%;">
                <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <td>
                                <span v-if="Venta.empresa_id == 3 || Venta.empresa_id == 4">
                                    <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png" style="width: 100px;">
                                </span>
                                <span v-if="Venta.empresa_id == 1 || Venta.empresa_id == 5">
                                    <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png" style="width: 150px;">
                                </span>
                            </td>
                            <td colspan="5" style="text-align: center;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <b>NOTA DE ENTREGA</b>
                                    <span class="ml-6">{{Venta.ven_tipo_inst}}</span>
                                    <b>{{Venta.ven_codigo}}</b>
                                </div>
                                <div class="vx-row" v-if="Venta.ven_codigo && groupBodega" style="margin-top: 10px;">
                                    <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6" style="text-align: right;">
                                        <!-- Barcode justo debajo de ven_codigo -->
                                        <barcodeReutilizableVue :barcodeValue="Venta.ven_codigo" :width="0.8" :height="20" :barcodeId="'barcode-nota'" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td> <b>Fecha:</b></td>
                            <td>
                                <p>{{Venta.ven_fecha}}</p>
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                                <p v-if="Venta.ven_tipo_inst =='L'">NO APLICA</p>
                                <p v-if="Venta.ven_tipo_inst =='V'">{{Venta.responsable}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Cliente: </b></td>
                            <td>
                                <p>{{Venta.cliente}}</p>
                            </td>
                            <td></td>
                            <td><b>RUC: </b></td>
                            <td>
                                <p>{{Venta.cedula}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td v-if="Venta.ven_tipo_inst=='V'"><b>Institución: </b></td>
                            <td v-if="Venta.ven_tipo_inst=='L'"><b>Librería: </b></td>
                            <td colspan="4">
                                <p>{{Venta.nombreInstitucion}}</p>
                            </td>
                        </tr>

                        <tr>
                            <td><b>Dirección: </b></td>
                            <td>
                                <p>{{Venta.direccionInstitucion}}</p>
                            </td>
                            <td width="50"></td>
                            <td><b>Telefóno: </b></td>
                            <td>
                                <p>{{Venta.telefono}}</p>
                            </td>
                        </tr>
                        <tr>
                            <!-- <template v-if="Venta.ven_idproforma">
                                <td><b>Pre-Proforma: </b></td>
                                <td>{{Venta.ven_idproforma}}</td>
                            </template> -->

                            <template v-if="Venta.ven_idproforma">
                                <td><b>Pre-Proforma: </b></td>
                                <td style="display: flex; flex-direction: column; align-items: center;">
                                    <span>{{Venta.ven_idproforma}}</span>
                                    <barcodeReutilizableVue :barcodeValue="Venta.ven_idproforma" :width="0.8" :height="20" :barcodeId="'barcode-proforma-nota'" />
                                </td>
                            </template>
                            <template v-else-if="Venta.ven_p_libros_obsequios">
                                <td> <b>HIJOS DOCENTES</b></td>
                                <td></td>
                            </template>
                            <td></td>
                            <td>
                                <b v-if="Venta.ven_tipo_inst =='L'">Facturador:</b>
                                <b v-if="Venta.ven_tipo_inst =='V'">Cód. promotor/Vendedor:</b>
                            </td>
                            <td>{{Venta.responsable}}</td>
                        </tr>
                        <tr style="height: 8px; border: transparent"></tr>
                    </thead>
                </table>
                <table class="tabla1" style="width: 100%; border-collapse: collapse; border: none; text-align: start;">
                    <thead>
                        <tr>
                            <th>Código </th>
                            <th>Cantidad</th>
                            <th>Detalle </th>
                            <th>Valor Unitario</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(input, k) in DetalleVenta" :key="k">
                            <td>{{ input.pro_codigo }}</td>
                            <td align="center">{{ input.det_ven_cantidad }}</td>
                            <td> {{input.nombre}} <span v-if="input.id_serie==19"><br> <b>Descripción combo:</b> {{ input.descripcionlibro }} </span></td>
                            <td align="center">{{ input.det_ven_valor_u }}</td>
                            <td style="text-align: right;">{{ input.subtotal=(parseFloat(input.det_ven_cantidad || 0)*parseFloat(input.det_ven_valor_u || 0)).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="tabla1" style="width: 100%; border-collapse: collapse; border: none; text-align: start;">
                    <tbody>
                        <tr>
                            <td rowspan="5" align="letf"><b>Observación:</b> {{Venta.ven_observacion ? Venta.ven_observacion: Venta.prof_observacion}}<br /><br />
                                <b>Notas: </b> SOLO SE ACEPTARAN RECLAMOS DENTRO DE LOS 4 DÍAS POSTERIORES AL DESPACHO </td>
                            <td style="min-width: 100px;"> <b>Suman $:</b></td>
                            <td style="text-align: right; min-width:80px">
                                <b>{{ parseFloat(Venta.ven_subtotal || 0).toFixed(2) }}</b>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;"> <b>Desc. {{ Venta.ven_desc_por }} $:</b></td>
                            <td style="text-align: right;">
                                <b>{{ parseFloat((parseFloat(Venta.ven_subtotal || 0)*parseFloat(Venta.ven_desc_por || 0))/100).toFixed(2) }}</b>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;"> <b>Subtotal $:</b></td>
                            <td style="text-align: right;">
                                <b>{{ (parseFloat(Venta.ven_subtotal || 0) - parseFloat(Venta.ven_descuento || 0)).toFixed(2) }}</b>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;"> <b>Transporte $:</b></td>
                            <td style="text-align: right;">
                                <b>{{ Venta.ven_transporte?  Venta.ven_transporte : 0 }}</b>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;"> <b>TOTAL $:</b></td>
                            <td style="text-align: right;">
                                <b>{{ parseFloat(Venta.ven_valor || 0).toFixed(2) }}</b>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <vs-row style="height: 80px;">
                    <vs-col vs-justify="center" vs-align="center" vs-w="12" vs-type="flex">
                        <vs-row vs-justify="center" vs-align="center" vs-w="10" vs-type="flex" class="m-t2">

                        </vs-row>
                    </vs-col>
                </vs-row>
                <div>
                    <div>
                        <div style="font-size: 11px; float: left; text-align: center; border-top: solid 1px black; margin-left: 80px; padding: 0px 15px;">
                            <b>Deudor / Recibí Conforme</b>
                        </div>
                        <div style="font-size: 11px; float: right; text-align: center; border-top: solid 1px black; margin-right: 80px; padding: 0px 30px;">
                            <b>Entregué Conforme</b>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
        <div v-if="Venta.idtipodoc == 16" style="width: 100%;">
            <vx-card style="width: 100%;">
                <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
                <table style="width: 100%; border-collapse: collapse; border: none; text-align: start;">
                    <thead>
                        <tr>
                            <td>
                                <span v-if="Venta.empresa_id == 3 || Venta.empresa_id == 4">
                                    <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png" style="width: 100px;">
                                </span>
                                <span v-if="Venta.empresa_id == 1 || Venta.empresa_id == 5">
                                    <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png" style="width: 150px;">
                                </span>
                            </td>
                            <td colspan="4" style="text-align: center;">
                                <div style="display: flex; justify-content:space-around;">
                                    <b> NOTA DE CREDITO </b> <span class="ml-6">{{Venta.ven_tipo_inst}}</span> <b> {{Venta.ven_codigo}} </b>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td> <b>Fecha:</b></td>
                            <td>
                                <p>{{Venta.fecha_notaCredito}}</p>
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                                <p v-if="Venta.ven_tipo_inst =='L'">NO APLICA</p>
                                <p v-if="Venta.ven_tipo_inst =='V'">{{Venta.responsable}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Cliente: </b></td>
                            <td>
                                <p>{{Venta.cliente}}</p>
                            </td>
                            <td></td>
                            <td><b>RUC: </b></td>
                            <td>
                                <p>{{Venta.cedula}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td v-if="Venta.ven_tipo_inst=='V'"><b>Institución: </b></td>
                            <td v-if="Venta.ven_tipo_inst=='L'"><b>Librería: </b></td>
                            <td colspan="4">
                                <p>{{Venta.nombreInstitucion}}</p>
                            </td>
                        </tr>

                        <tr>
                            <td><b>Dirección: </b></td>
                            <td>
                                <p>{{Venta.direccionInstitucion}}</p>
                            </td>
                            <td width="50"></td>
                            <td><b>Telefóno: </b></td>
                            <td>
                                <p>{{Venta.telefono}}</p>
                            </td>
                        </tr>
                        <tr>
                            <template v-if="Venta.ven_idproforma">
                                <td><b>Pre-Proforma: </b></td>
                                <td>{{Venta.ven_idproforma}}</td>
                            </template>
                            <template v-else-if="Venta.ven_p_libros_obsequios">
                                <td> <b>HIJOS DOCENTES</b></td>
                                <td></td>
                            </template>
                            <td></td>
                            <td>
                                <b v-if="Venta.ven_tipo_inst =='L'">Facturador:</b>
                                <b v-if="Venta.ven_tipo_inst =='V'">Cód. promotor/Vendedor:</b>
                            </td>
                            <td>{{Venta.responsable}}</td>
                        </tr>
                        <tr style="height: 8px; border: transparent"></tr>
                    </thead>
                </table>
                <div style="display: flex; flex-direction: column;">
                    <!-- Primera tabla -->
                    <table class="tabla1" style="width: 100%; border-collapse: collapse; border: none; text-align: start;">
                        <thead>
                            <tr>
                                <th>Código </th>
                                <th>Cantidad</th>
                                <th>Descripción </th>
                                <th>Valor Unitario</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(input, k) in DetalleVenta" :key="k">
                                <td>{{ input.pro_codigo }}</td>
                                <td align="center">{{ input.det_ven_cantidad }}</td>
                                <td> {{input.nombre}} <span v-if="input.id_serie==19"><br> {{ input.descripcionlibro }} </span></td>
                                <td align="center">{{ input.det_ven_valor_u }}</td>
                                <td style="text-align: right;">{{ input.subtotal=(parseFloat(input.det_ven_cantidad || 0)*parseFloat(input.det_ven_valor_u || 0)).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Segunda tabla alineada en las dos últimas columnas -->
                    <div style="display: flex; justify-content: flex-end;">
                        <table class="tabla1" style="width: auto; border-collapse: collapse; border: none; text-align: start;">
                            <tbody>
                                <tr>
                                    <td style="min-width: 100px;"> <b>Suman $:</b></td>
                                    <td style="text-align: right; min-width:80px">
                                        <b>{{ Venta.ven_subtotal }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: left;"> <b>Desc. {{ Venta.ven_desc_por }} $:</b></td>
                                    <td style="text-align: right;">
                                        <b>{{ parseFloat((parseFloat(Venta.ven_subtotal || 0)*parseFloat(Venta.ven_desc_por || 0))/100).toFixed(2) }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: left;"> <b>Subtotal $:</b></td>
                                    <td style="text-align: right;">
                                        <b>{{ (parseFloat(Venta.ven_subtotal || 0) - parseFloat(Venta.ven_descuento || 0)).toFixed(2) }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: left;"> <b>Transporte $:</b></td>
                                    <td style="text-align: right;">
                                        <b>{{ Venta.ven_transporte?  Venta.ven_transporte : 0 }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: left;"> <b>TOTAL $:</b></td>
                                    <td style="text-align: right;">
                                        <b>{{ parseFloat(Venta.ven_valor || 0).toFixed(2) }}</b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <vs-row style="height: 80px;">
                    <vs-col vs-justify="center" vs-align="center" vs-w="12" vs-type="flex">
                        <vs-row vs-justify="center" vs-align="center" vs-w="10" vs-type="flex" class="m-t2">

                        </vs-row>
                    </vs-col>
                </vs-row>
                <div>
                    <div>
                        <div style="font-size: 11px; float: left; text-align: center; border-top: solid 1px black; margin-left: 80px; padding: 0px 15px;">
                            <b>Deudor / Recibí Conforme</b>
                        </div>
                        <div style="font-size: 11px; float: right; text-align: center; border-top: solid 1px black; margin-right: 80px; padding: 0px 30px;">
                            <b>Entregué Conforme</b>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
        <div v-if="Venta.idtipodoc == 17" style="width: 100%;">
            <vx-card style="width: 100%;">
                <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
                <table style="width: 100%; border-collapse: collapse; border: none; text-align: start;">
                    <thead>
                        <tr>
                            <td>
                                <span v-if="Venta.empresa_id == 3 || Venta.empresa_id == 4">
                                    <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png" style="width: 100px;">
                                </span>
                                <span v-if="Venta.empresa_id == 1 || Venta.empresa_id == 5">
                                    <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png" style="width: 150px;">
                                </span>
                            </td>
                            <td colspan="4" style="text-align: center;">
                                <div style="display: flex; justify-content:space-around;">
                                    <b> NOTA DE CREDITO INTERNA</b> <b> {{Venta.ven_codigo}} </b>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td> <b>Fecha:</b></td>
                            <td>
                                <p>{{Venta.ven_fecha}}</p>
                            </td>
                            <td></td>
                            <td></td>
                            <td>

                            </td>
                        </tr>
                        <tr>
                            <td><b>Cliente: </b></td>
                            <td>
                                <p>{{Venta.cliente}}</p>
                            </td>
                            <td></td>
                            <td><b>RUC: </b></td>
                            <td>
                                <p>{{Venta.cedula}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td v-if="Venta.ven_tipo_inst=='V'"><b>Institución: </b></td>
                            <td v-if="Venta.ven_tipo_inst=='L'"><b>Librería: </b></td>
                            <td colspan="4">
                                <p>{{Venta.nombreInstitucion}}</p>
                            </td>
                        </tr>

                        <tr>
                            <td><b>Dirección: </b></td>
                            <td>
                                <p>{{Venta.direccionInstitucion}}</p>
                            </td>
                            <td width="50"></td>
                            <td><b>Telefóno: </b></td>
                            <td>
                                <p>{{Venta.telefono}}</p>
                            </td>
                        </tr>
                        <tr>
                            <template v-if="Venta.ven_idproforma">
                                <td><b>Pre-Proforma: </b></td>
                                <td>{{Venta.ven_idproforma}}</td>
                            </template>
                            <template v-else-if="Venta.ven_p_libros_obsequios">
                                <td> <b>HIJOS DOCENTES</b></td>
                                <td></td>
                            </template>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr style="height: 8px; border: transparent"></tr>
                    </thead>
                </table>
                <div style="display: flex; flex-direction: column;">
                    <!-- Primera tabla -->
                    <table class="tabla1" style="width: 95%; text-align: center;">
                        <thead>
                            <tr>
                                <th style="text-align: center;">Cantidad</th>
                                <th>Descripción</th>
                                <th style="text-align: center;">Valor Unitario</th>
                                <th style="text-align: right;">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(input, k) in DetalleVenta" :key="k">
                                <td align="center">{{ input.det_ven_cantidad }}</td>
                                <td style="text-align: left;">{{ input.detalle_notaCreditInterna }}</td>
                                <td align="center">{{ input.det_ven_valor_u }}</td>
                                <td style="text-align: right;">{{ input.subtotal=(parseFloat(input.det_ven_cantidad || 0)*parseFloat(input.det_ven_valor_u || 0)).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Segunda tabla alineada en las dos últimas columnas -->
                    <div style="display: flex; justify-content: flex-end;">
                        <table class="tabla1" style="width: auto; text-align: center;">
                            <tbody>
                                <tr>
                                    <td style="min-width: 100px; text-align: left;"><b>SUBTOTAL:</b></td>
                                    <td style="text-align: right; min-width:80px; padding-right: 40px;">
                                        <b>{{ parseFloat(Venta.ven_subtotal || 0).toFixed(2) }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: left;"> <b>Desc. {{ Venta.ven_desc_por }} $:</b></td>
                                    <td style="text-align: right;  min-width:80px; padding-right: 40px;">
                                        <b>{{ parseFloat((parseFloat(Venta.ven_subtotal || 0)*parseFloat(Venta.ven_desc_por || 0))/100).toFixed(2) }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: left;"> <b>TOTAL $:</b></td>
                                    <td style="text-align: right;  min-width:80px; padding-right: 40px;">
                                        <b>{{ parseFloat(Venta.ven_valor || 0).toFixed(2) }}</b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <vs-row style="height: 80px;">
                    <vs-col vs-justify="left" vs-align="left" vs-w="12" vs-type="flex">
                        <vs-row vs-justify="left" vs-align="left" vs-w="10" vs-type="flex" class="m-t2">
                            <b style="margin-right: 10px;">NOTA </b> {{ Venta.referencia_nota_cred_interna  }}
                        </vs-row>
                    </vs-col>
                </vs-row>
            </vx-card>
        </div>
    </div>
</div>
</template>

<script>
import vSelect from 'vue-select';
import {
    mapState
} from "vuex";
import imprimirMixin from "@/mixins/Pedidosmix";
const barcodeReutilizableVue = () => import('./barcodeReutilizable.vue');
export default {
    mixins: [imprimirMixin],
    computed: {
        ...mapState(["AdminBodega", 'groupFacturador', 'groupBodega']),
    },
    components: {
        vSelect,
        barcodeReutilizableVue,
    },
    props: {
        DocumentoVenta: {
            type: Object,
            default: () => {},
        },
        DocumentoDetalleVenta: {
            type: Array,
            default: () => [],
        }
    },
    data() {
        return {
            Venta: [],
            DetalleVenta: [],
            nombreEmpresaActual: '',
            busquedaReferencia: '',
        };
    },
    mounted() {
        this.Venta = this.DocumentoVenta;
        this.DetalleVenta = this.DocumentoDetalleVenta;
        if (this.Venta.idtipodoc == 17) {
            this.buscarReferencia()
        }
        this.empresaActual()
    },
    methods: {
        async empresaActual() {
            await this.$http.get(this.$server_url + 'empresaActual')
                .then(res => {
                    this.nombreEmpresaActual = res.data[0].descripcion_corta;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        imprimir() {
            let formData = new FormData();
            let me = this;
            formData.append("ven_codigo", me.Venta.ven_codigo);
            formData.append("id_empresa", me.Venta.empresa_id);
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "imprimirDVenta", formData)
                .then((res) => {
                    me.$vs.loading.close();
                    if (res.data.status == '0') {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        return;
                    }
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    me.$emit('change', true);
                })
                .catch((error) => {
                    console.log(error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "No se pudo anular",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        buscarReferencia() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getReferenciaNotaCredito?id=' + this.Venta.ven_codigo)
                .then(res => {
                    if (res.data && res.data.length > 0) {
                        // Accedemos al primer elemento del arreglo y tomamos su propiedad
                        me.Venta.referencia_nota_cred_interna = res.data[0].referencia_nota_cred_interna;
                    } else {
                        console.log("No se encontró referencia en la respuesta.");
                        me.Venta.referencia_nota_cred_interna = null;
                    }
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error("Error al buscar la referencia:", err);
                    me.$vs.loading.close();
                });
        },
    }
};
</script>
