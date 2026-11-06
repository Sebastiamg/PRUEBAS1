<template>
    <vx-card    
    :title="'Reporte de trazabilidad del pedido #'+pedido.id_pedido"
    title-color="primary"
    subtitle="">
    <ul class="mb-1">
        <!-- <pre>
            {{ arregloTransabilidad }}
        </pre> -->
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                    <span class="font-semibold">Creación de pedido ({{ arregloTransabilidad.pedido_creacion }})</span>
                </span>
                <!-- <span>{{ arregloTransabilidad.pedido_creacion }}</span> -->
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                    <span class="font-semibold">Aprobado anticipo gerencia / facturador ({{ arregloTransabilidad.fecha_aprobacion_anticipo_gerencia }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia1 }} horas</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-danger"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.fecha_rechazo_gerencia == null || arregloTransabilidad.fecha_rechazo_gerencia == 'null'">Rechazo gerencia (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Rechazo gerencia ({{ arregloTransabilidad.fecha_rechazo_gerencia }})</span>
                </span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-primary"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.f_generateContrato == null || arregloTransabilidad.f_generateContrato == 'null'">Generar contrato (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Generar contrato ({{ arregloTransabilidad.f_generateContrato }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia2 }} horas</span>
            </li>
            
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-success"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.fecha_contabilidad_recibe == null || arregloTransabilidad.fecha_contabilidad_recibe == 'null'">Contabilidad recibe (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Contabilidad recibe ({{ arregloTransabilidad.fecha_contabilidad_recibe }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia3 }} horas</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.fecha_contabilidad_sube_cheque_sin_firmar == null || arregloTransabilidad.fecha_contabilidad_sube_cheque_sin_firmar == 'null'">Subir cheque sin firmar (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Subir cheque sin firmar ({{ arregloTransabilidad.fecha_contabilidad_sube_cheque_sin_firmar }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia4 }} horas</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-success"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.fecha_subir_cheque == null || arregloTransabilidad.fecha_subir_cheque == 'null'">Subir cheque firmado (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Subir cheque firmado ({{ arregloTransabilidad.fecha_subir_cheque }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia5 }} horas</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-dark"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.fecha_facturador_recibe_cheque == null || arregloTransabilidad.fecha_facturador_recibe_cheque == 'null'">Facturador recibe el cheque (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Facturador recibe el cheque ({{ arregloTransabilidad.fecha_facturador_recibe_cheque }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia6 }} horas</span>
            </li>
            
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-danger"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.fecha_envio_cheque_for_asesor == null || arregloTransabilidad.fecha_envio_cheque_for_asesor == 'null'">Facturador envia cheque al asesor (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Facturador envia cheque al asesor ({{ arregloTransabilidad.fecha_envio_cheque_for_asesor }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia7 }} horas</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-primary"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.fecha_orden_firmada == null || arregloTransabilidad.fecha_orden_firmada == 'null'">Asesor sube Pagaré firmado (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Asesor sube Pagaré firmado ({{ arregloTransabilidad.fecha_orden_firmada }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia8 }} horas</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.fecha_que_recibe_orden_firmada == null || arregloTransabilidad.fecha_que_recibe_orden_firmada == 'null'">Asesor entrega Pagaré firmado fisico - facturador (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Asesor entrega Pagaré firmado fisico - facturador ({{ arregloTransabilidad.fecha_que_recibe_orden_firmada }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia9 }} horas</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-primary"></span>
                    <span class="font-semibold" v-if="arregloTransabilidad.fecha_que_recibe_orden_firmada_contabilidad == null || arregloTransabilidad.fecha_que_recibe_orden_firmada_contabilidad == 'null'">Facturador entrega Pagaré firmado fisico - contabilidad (<span class="font-bold text-warning">No existe fecha</span>) </span>
                    <span class="font-semibold" v-else>Facturador entrega Pagaré firmado fisico - contabilidad ({{ arregloTransabilidad.fecha_que_recibe_orden_firmada_contabilidad }})</span>
                </span>
                <span>despues de {{ arregloTransabilidad.diferencia10 }} horas</span>
            </li>
        </ul>
        <vs-divider>Grafico estadístico</vs-divider>
        <p style="display: none;">{{ series }}</p>
        <div id="chart" style="width: 100%;">
        <apexchart
          type="bar"
          height="350"
          :options="options"
          :series="[series[0]]"
        ></apexchart>
      </div>
    </vx-card>
</template>
<script>
import chart from "vue-apexcharts";
import moment from 'moment'
export default{
    components: { apexchart: chart },
    data(){
        return{
            arregloTransabilidad:[],
            tmpArreglo:[],
            datosMostrar:[],
            series: [{
                name: 'Reporte de trazabilidad',
                data: []
            }],
            options: {
                chart: {
                height: 350,
                type: 'bar',
                },
                plotOptions: {
                bar: {
                    borderRadius: 10,
                    dataLabels: {
                    position: 'top', // top, center, bottom
                    },
                },
                },
                dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + ' horas.';
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ['#304758'],
                },
                },

                xaxis: {
                categories: [
                    'Anticipo aprobado',
                    'Generar Contrato',
                    'Recibe contabilidad',
                    'Cheque sin firmar',
                    'Cheque firmado',
                    'Recibe cheque',
                    'Envia cheque',
                    'Sube pagaré',
                    'entr. Pagaré (fact)',
                    'entr. Pagaré (cont.)',
                ],
                position: 'top',
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    },
                    },
                },
                tooltip: {
                    enabled: true,
                },
                },
                yaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    formatter: function (val) {
                    return val + '%';
                    },
                },
                },
                title: {
                text: '',
                floating: true,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444',
                },
                },
            },
        }
    },
    props:{
        pedido:{
            type:Array,
            default:{}
        },
    },
    created(){
        let me = this;
    },
    mounted(){
        let me = this
        me.getTransabilidad()
    },
    methods:{
        getTransabilidad(){
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url+'getTransabilidad/'+me.pedido.id_pedido)
                .then(function (res) {
                    //me.arregloTransabilidad = res.data[0]
                    me.$vs.loading.close()
                    let datos = res.data[0]
                    var cal = new Object();
                    cal.pedido_creacion                                 = datos.pedido_creacion
                    cal.fecha_aprobacion_anticipo_gerencia              = datos.fecha_aprobacion_anticipo_gerencia
                    cal.fecha_rechazo_gerencia                          = datos.fecha_rechazo_gerencia
                    cal.f_generateContrato                              = datos.f_generateContrato
                    cal.fecha_contabilidad_recibe                       = datos.fecha_contabilidad_recibe
                    cal.fecha_contabilidad_sube_cheque_sin_firmar       = datos.fecha_contabilidad_sube_cheque_sin_firmar
                    cal.fecha_subir_cheque                              = datos.fecha_subir_cheque
                    cal.fecha_facturador_recibe_cheque                  = datos.fecha_facturador_recibe_cheque
                    cal.fecha_envio_cheque_for_asesor                   = datos.fecha_envio_cheque_for_asesor
                    cal.fecha_orden_firmada                             = datos.fecha_orden_firmada
                    cal.fecha_que_recibe_orden_firmada                  = datos.fecha_que_recibe_orden_firmada
                    cal.fecha_que_recibe_orden_firmada_contabilidad     = datos.fecha_que_recibe_orden_firmada_contabilidad
                    //=====DIFERENCIAS======
                    //diferencia entre la fecha de anticipo - la fecha de creacion
                    let lapso1 = me.calculateHours(datos.fecha_aprobacion_anticipo_gerencia,datos.pedido_creacion)
                    cal.diferencia1 = lapso1
                    me.datosMostrar.push(lapso1)
                    //diferencia entre la fecha de generar contrato - la fecha de anticipo 
                    let lapso2 = me.calculateHours(datos.f_generateContrato,datos.fecha_aprobacion_anticipo_gerencia)
                    cal.diferencia2 = lapso2
                    me.datosMostrar.push(lapso2)
                    //diferencia entre contabilidad recibe - la fecha de generar contrato
                    let lapso3 = me.calculateHours(datos.fecha_contabilidad_recibe,datos.f_generateContrato)
                    cal.diferencia3 = lapso3
                    me.datosMostrar.push(lapso3)
                    //diferencia entre Subir cheque sin firmar - la fecha  de contabilidad recibe
                    let lapso4 = me.calculateHours(datos.fecha_contabilidad_sube_cheque_sin_firmar,datos.fecha_contabilidad_recibe)
                    cal.diferencia4 = lapso4
                    me.datosMostrar.push(lapso4)
                    //diferencia entre Subir cheque firmado - la fecha cheque sin firmar 
                    let lapso5 = me.calculateHours(datos.fecha_subir_cheque,datos.fecha_contabilidad_sube_cheque_sin_firmar)
                    cal.diferencia5 = lapso5
                    me.datosMostrar.push(lapso5)
                    //diferencia entre Facturador recibe el cheque - Subir cheque firmado
                    let lapso6 = me.calculateHours(datos.fecha_facturador_recibe_cheque,datos.fecha_subir_cheque)
                    cal.diferencia6 = lapso6
                    me.datosMostrar.push(lapso6)
                    //diferencia entre Facturador envia cheque al asesor - Facturador recibe el cheque
                    let lapso7 = me.calculateHours(datos.fecha_envio_cheque_for_asesor,datos.fecha_facturador_recibe_cheque)
                    cal.diferencia7 = lapso7
                    me.datosMostrar.push(lapso7)
                    //diferencia entre Asesor sube Pagaré firmado - Facturador envia cheque al asesor
                    let lapso8 = me.calculateHours(datos.fecha_orden_firmada,datos.fecha_facturador_recibe_cheque)
                    cal.diferencia8 = lapso8
                    me.datosMostrar.push(lapso8)
                    //diferencia entre entrega Pagaré firmado fisico(facturador) - Asesor sube Pagaré firmado
                    let lapso9 = me.calculateHours( datos.fecha_que_recibe_orden_firmada, datos.fecha_orden_firmada )
                    cal.diferencia9 = lapso9
                    me.datosMostrar.push(lapso9)
                    //diferencia entre entrega Pagaré firmado fisico(contabilidad) - Pagaré firmado fisico(facturador)
                    let lapso10 = me.calculateHours( datos.fecha_que_recibe_orden_firmada_contabilidad, datos.fecha_que_recibe_orden_firmada )
                    cal.diferencia10 = lapso10
                    me.datosMostrar.push(lapso10)
                    //enviar datos
                    me.setRender(me.datosMostrar)
                    //this.series[0].data = me.datosMostrar;
                    me.tmpArreglo.push(cal)
                    me.arregloTransabilidad = me.tmpArreglo[0]
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        setRender(tr){
            let me = this
            var arreglo = tr
            this.series[0].data = arreglo
        },
        calculateHours(fecha_mayor,fecha_menor){
            if(fecha_mayor == null || fecha_menor == null ){
                return 0
            }{
                const fecha1 = new Date(Date.parse(fecha_menor.replace(' ', 'T')));
                const fecha2 = new Date(Date.parse(fecha_mayor.replace(' ', 'T')));
                const diferenciaEnMilisegundos = (fecha2 - fecha1);
                // const diferenciaEnMilisegundos = Math.abs(fecha2 - fecha1);
                const diferenciaEnHoras = Math.floor(diferenciaEnMilisegundos / 3600000);
                return diferenciaEnHoras
            }
           
        },
        //metodo par descargar el excel
        ExportToExcel(type, fn, dl) {
        var elt = document.getElementById('tbl_exporttable_to_xls');
        var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
        return dl ?
            XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
            XLSX.writeFile(wb, fn || ('ReporteTareas.' + (type || 'xlsx')));
        
        }
    }
}
</script>