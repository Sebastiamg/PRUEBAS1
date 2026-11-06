<template>
    <div>
        <vx-card>
            <vs-alert style="height: 60px;">
                <p><i class="fa-solid fa-circle-info"></i> Este reporte se trata de la cantidad de <b>libros facturados</b> y las que fueron enviadas a <b>Perseo</b> de la Empresa Prolipa</p>
            </vs-alert>
            <br>
            <!--Tipo de venta-->
            <div v-if="periodoSelected">
                <ul class="flex mt-2">
                    <li class="mr-3">
                      <p>Tipo de venta:</p>
                    </li>
                    <li class="mr-3">
                    <vs-radio v-model="tipoVenta" @input="f_getReporte" vs-name="radios1tipoVenta" vs-value="1">Venta directa</vs-radio>
                    </li>
                    <li>
                    <vs-radio v-model="tipoVenta" @input="f_getReporte" vs-name="radios1tipoVenta" vs-value="2">Venta lista</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-divider></vs-divider>
            <!--Tipo de venta-->
            <div>
                <PeriodoReutilizableVue @changePeriodo="changePeriodo"/>
            </div>
            <!--boton para exportar-->
            <div v-if="arrayReporte.length>0">
                <vs-button color="success" class="mr-3" @click="f_exportar();">Exportar</vs-button>
                <vs-button color="primary" @click="popupMostrarAgrupadoPrecio = true;"><i class="fa-solid fa-comments-dollar"></i> Mostrar agrupados por precio</vs-button>
            </div>

            <div>
                <vs-table max-items="10" stripe search pagination :data="arrayReporte">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b>{{ arrayReporte.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Institución</vs-th>
                    <vs-th>Detalles</vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        # {{ tr.institucion_id }}<br>
                        {{ tr.nombreInstitucion }}<br>
                        <div v-if="tr.prefacturas.length > 0">
                            <vs-divider>Pre facturas</vs-divider>
                            <div v-for="(prefactura, index) in tr.prefacturas" :key="index">
                                <p>{{ prefactura.ven_codigo }}</p>
                            </div>
                        </div>
                        <!--contratos-->
                        <div v-if="tr.contratos.length > 0">
                            <vs-divider>Contratos</vs-divider>
                            <div v-for="(contrato, index) in tr.contratos" :key="index">
                                <p>{{ contrato.contrato_generado }}</p>
                            </div>
                        </div>
                    </vs-td>
                    <vs-td>
                        <vs-table max-items="10" stripe search pagination :data="tr.resultadoProductos">
                            <template slot="thead">
                                <vs-th>Producto</vs-th>
                                <vs-th>Cantidad Despachada</vs-th>
                                <vs-th>Cantidad Devuelta</vs-th>
                                <vs-th>Cantidad Pre facturas</vs-th>
                                <vs-th>Cantidad Facturada</vs-th>
                                <vs-th>Cantidad Desfasada</vs-th>
                                <vs-th>Precio Unit.</vs-th>
                            </template>
                            <template slot-scope="{ data: resultadoProductos }">
                                <vs-tr :key="indextr2" v-for="(item, indextr2) in resultadoProductos">
                                <vs-td>{{ item.proCodigo }}</vs-td>
                                <vs-td>{{ item.det_ven_cantidad }}</vs-td>
                                <vs-td>{{ item.det_ven_dev }}</vs-td>
                                <vs-td>{{ item.cantidad_real }}</vs-td>
                                <vs-td>{{ item.cantidad_perseo }}</vs-td>
                                <vs-td>{{ item.cantidad_real - item.cantidad_perseo }}</vs-td>
                                <vs-td>{{ item.det_ven_valor_u }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-td>
                    </vs-tr>
                </template>
                </vs-table>
            </div>
        </vx-card>
        <vs-popup classContent="popup-example" title="Agrupados por precio"  :active.sync="popupMostrarAgrupadoPrecio">
            <div v-if="popupMostrarAgrupadoPrecio">
                <ul class="flex">
                    <li  class="mr-2">
                        <p>Seleccione el tipo de precio</p>
                    </li>
                    <li class="mr-2">
                        <vs-radio v-model="tipoPrecio" vs-name="radios1tipoPrecio" vs-value="0">Precios  Pre facturas</vs-radio>
                    </li>
                    <li class="mr-2">
                        <vs-radio v-model="tipoPrecio" vs-name="radios1tipoPrecio" vs-value="1">Precios  Facturado</vs-radio>
                    </li>
                </ul>
                <vs-divider></vs-divider>
                <div v-if="tipoPrecio == 0">
                    <TableReutilizableVue
                        :title="'Agrupados por precio Pre facturas'"
                        :headers="['Serie','Precio','Cantidad']"
                        :fieldKeys="['nombre_serie','det_ven_valor_u','cantidad_real']"
                        :tableData="productos_agrupados_por_precio_real"
                        :ifexportar="Number(1)"
                        :nombrearchivo="'ReportePreciosPrefacturas_' + 'Prolipa'"
                    />

                </div>
                <div v-if="tipoPrecio == 1">
                    <TableReutilizableVue
                        :title="'Agrupados por precio Facturado'"
                        :headers="['Serie','Precio','Cantidad']"
                        :fieldKeys="['nombre_serie','det_ven_valor_u','cantidad_perseo']"
                        :tableData="productos_agrupados_por_precio_perseo"
                        :ifexportar="Number(1)"
                        :nombrearchivo="'ReportePreciosFacturados_' + 'Prolipa'"
                    />
                </div>
            </div>
        </vs-popup>
    </div>
</template>
<script>
const PeriodoReutilizableVue = () => import('./PeriodoReutilizable.vue')
const TableReutilizableVue   = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')

import Generalmix from '../../../mixins/Generalmix';
import * as XLSX from "xlsx"; // Librería para exportar a Excel
export default{
    mixins: [Generalmix],
    components:{
        PeriodoReutilizableVue,
        TableReutilizableVue,
    },
    data(){
        return{
            arrayPeriodos:[],
            periodoSelected: '',
            tipoRegion: '1',
            arrayReporte:[],
            productos_agrupados_por_precio_real:[], //para mostrar en el modal
            productos_agrupados_por_precio_perseo:[], //para mostrar en el modal
            popupMostrarAgrupadoPrecio:false,
            tipoPrecio:0,
            tipoVenta:1,
        }
    },
    methods:{
        changePeriodo(periodo, periodos, tipoRegion){
            let me = this;
            this.arrayReporte    = [];
            this.periodoSelected = periodo
            this.arrayPeriodos   = periodos
            this.tipoRegion      = tipoRegion
            me.f_getReporte()
        },
        f_getReporte(){
            let me = this;
            me.arrayReporte = []
            me.productos_agrupados_por_precio_real = [] //para mostrar en el modal
            me.productos_agrupados_por_precio_perseo = [] //para mostrar en el modal
            if(me.periodoSelected == '' || me.periodoSelected == null || me.periodoSelected == undefined){
                me.m_message('Debe seleccionar un periodo','danger')
                return false;
            }
            me.$vs.loading();
            this.$http.get(this.$server_url+`prefactura_documentos?getReportePrefacturaAgrupado=1&periodo_id=${ me.periodoSelected }&tipoVenta=${ me.tipoVenta }`)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.m_message(res.data.message,'danger')
                    return
                }
                let datos = res.data.getInstituciones
                me.arrayReporte = datos
                me.productos_agrupados_por_precio_real = res.data.productos_agrupados_por_precio_real
                me.productos_agrupados_por_precio_perseo = res.data.productos_agrupados_por_precio_perseo
            })
            .catch(function (error) {
                me.$vs.loading.close()
                me.m_message("Error al obtener los reportes", "error");
                console.log(error + ' error');
            })
        },
        // f_exportar(){
        //     let me = this;
        //     // Crear un nuevo libro de Excel
        //     const wb = XLSX.utils.book_new();

        //     // Crear una primera hoja con los nombres de los clientes y un secuencial
        //     const clientsData = this.arrayReporte.map((cliente, index) => {
        //         return {
        //             Secuencial: index + 1, // El número secuencial
        //             Institucion: cliente.nombreInstitucion,
        //             // RUC: cliente.ruc
        //         };
        //     });

        //     // Crear una hoja con los nombres de los clientes y su secuencial
        //     const wsClients = XLSX.utils.json_to_sheet(clientsData);

        //     // Agregar la primera hoja al libro (Hoja1)
        //     XLSX.utils.book_append_sheet(wb, wsClients, "Clientes");

        //     // Recorrer cada cliente en la lista de ventas y agregar una hoja con detalles
        //     this.arrayReporte.forEach((cliente, index) => {
        //         // Crear los datos para la tabla de resultadoProductos de cada cliente
        //         const dataForExcel = cliente.resultadoProductos.map((producto) => {
        //             return {
        //                 Producto: producto.proCodigo,
        //                 'Cantidad Despachada': producto.det_ven_cantidad,
        //                 "Cantidad Devuelta": producto.det_ven_dev,
        //                 'Cantidad Pre facturas': producto.cantidad_real,
        //                 "Cantidad Facturada": producto.cantidad_perseo,
        //                 "Cantidad Desfasada": producto.cantidad_real - producto.cantidad_perseo,
        //                 "Precio Unitario": producto.det_ven_valor_u,
        //             };
        //         });

        //         // Nombre de la pestaña usando el número secuencial
        //         let sheetName = (index + 1).toString(); // Usar el número secuencial como nombre de la pestaña

        //         // Recortar el nombre de la hoja a 31 caracteres si es necesario
        //         if (sheetName.length > 31) {
        //             sheetName = sheetName.substring(0, 31);
        //         }

        //         // Agregar un encabezado con el nombre del cliente en la pestaña
        //         const headerRow = [{
        //             v: "Nombre Cliente: " + cliente.nombreInstitucion,
        //             s: {
        //                 font: {
        //                     bold: true
        //                 }
        //             }
        //         }];

        //         // Fila vacía
        //         const emptyRow = [];

        //         // Encabezado para los datos de detalle de ventas
        //         const columnHeaders = [
        //             "Producto","Cantidad Despachada","Cantidad Devuelta","Cantidad Pre facturas", "Cantidad Facturada", "Cantidad Desfasada",
        //             "Precio Unitario"
        //         ];

        //         // Convertir el encabezado en una hoja para agregarla antes del detalle
        //         const wsWithHeader = XLSX.utils.aoa_to_sheet([headerRow, emptyRow, columnHeaders]);

        //         // Convertir los datos del detalle de venta a una hoja
        //         const wsDetail = XLSX.utils.json_to_sheet(dataForExcel, {
        //             origin: 'A4'
        //         }); // Los datos empiezan en la fila 4

        //         // Combinar el encabezado con los detalles
        //         XLSX.utils.sheet_add_json(wsWithHeader, dataForExcel, {
        //             skipHeader: true,
        //             origin: {
        //                 r: 3,
        //                 c: 0
        //             }
        //         });

        //         // Crear la hoja para cada cliente con su nombre y los detalles de venta
        //         XLSX.utils.book_append_sheet(wb, wsWithHeader, sheetName);
        //     });
        //     let nombrTipoVenta = me.tipoVenta == 1 ? "Venta directa" : "Venta lista";
        //     // Exportar como archivo Excel
        //     let nombreArchivo = "ReporteVentasAgrupados_" + 'Prolipa_' + nombrTipoVenta + ".xlsx";

        //     // Ahora pasamos la variable al método writeFile
        //     XLSX.writeFile(wb, nombreArchivo);
    
        // }
        f_exportar() {
            let me = this;
            const wb = XLSX.utils.book_new();

            // Crear la primera hoja con los nombres de los clientes y un secuencial
            const clientsData = this.arrayReporte.map((cliente, index) => ({
                Secuencial: index + 1,
                Institucion: cliente.nombreInstitucion,
            }));
            const wsClients = XLSX.utils.json_to_sheet(clientsData);
            XLSX.utils.book_append_sheet(wb, wsClients, "Clientes");

            // Recorrer cada cliente en la lista de ventas y agregar una hoja con detalles
            this.arrayReporte.forEach((cliente, index) => {
                // Datos de productos
                const dataForExcel = cliente.resultadoProductos.map((producto) => ({
                    Producto: producto.proCodigo,
                    'Cantidad Despachada': producto.det_ven_cantidad,
                    'Cantidad Devuelta': producto.det_ven_dev,
                    'Cantidad Pre facturas': producto.cantidad_real,
                    'Cantidad Facturada': producto.cantidad_perseo,
                    'Cantidad Desfasada': producto.cantidad_real - producto.cantidad_perseo,
                    'Precio Unitario': producto.det_ven_valor_u,
                }));

                // Datos de contratos
                const contractsData = cliente.contratos.map((contrato) => ({
                    Contrato: contrato.contrato_generado
                }));

                let sheetName = (index + 1).toString();
                if (sheetName.length > 31) sheetName = sheetName.substring(0, 31);

                // Encabezado
                const headerRow = [["Nombre Cliente: " + cliente.nombreInstitucion]];
                const emptyRow = [[]];
                const columnHeaders = [[
                    "Producto", "Cantidad Despachada", "Cantidad Devuelta", "Cantidad Pre facturas",
                    "Cantidad Facturada", "Cantidad Desfasada", "Precio Unitario"
                ]];

                // Crear hoja y agregar encabezado
                const wsWithHeader = XLSX.utils.aoa_to_sheet([...headerRow, ...emptyRow, ...columnHeaders]);
                XLSX.utils.sheet_add_json(wsWithHeader, dataForExcel, { skipHeader: true, origin: "A4" });
                
                // Agregar espacio antes de contratos
                XLSX.utils.sheet_add_aoa(wsWithHeader, emptyRow, { origin: `A${dataForExcel.length + 5}` });
                XLSX.utils.sheet_add_aoa(wsWithHeader, [["Contratos"]], { origin: `A${dataForExcel.length + 6}` });
                XLSX.utils.sheet_add_json(wsWithHeader, contractsData, { skipHeader: true, origin: `A${dataForExcel.length + 7}` });
                
                XLSX.utils.book_append_sheet(wb, wsWithHeader, sheetName);
            });

            let nombrTipoVenta = me.tipoVenta == 1 ? "Venta directa" : "Venta lista";
            let nombreArchivo = `ReporteVentasAgrupados_Prolipa_${nombrTipoVenta}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);
        }

    }
}
</script>