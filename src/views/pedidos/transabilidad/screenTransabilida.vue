<template>
    <div>
        <ul class="mb-1">
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                    <span class="font-semibold">Creación de pedido</span>
                </span>
                <span>{{ arregloTransabilidad.pedido_creacion }}</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                    <span class="font-semibold">Aprobado anticipo gerencia / facturador</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_aprobacion_anticipo_gerencia }}</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-danger"></span>
                    <span class="font-semibold">Rechazo gerencia</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_rechazo_gerencia }}</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-primary"></span>
                    <span class="font-semibold">Generar contrato</span>
                </span>
                <span>{{ arregloTransabilidad.f_generateContrato }}</span>
            </li>
            
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-success"></span>
                    <span class="font-semibold">Contabilidad recibe</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_contabilidad_recibe }}</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                    <span class="font-semibold">Subir cheque sin firmar</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_contabilidad_sube_cheque_sin_firmar }}</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-success"></span>
                    <span class="font-semibold">Subir cheque firmado</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_subir_cheque }}</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-dark"></span>
                    <span class="font-semibold">Facturador recibe el cheque</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_facturador_recibe_cheque }}</span>
            </li>
            
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-danger"></span>
                    <span class="font-semibold">Facturador envia cheque al asesor</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_envio_cheque_for_asesor }}</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-primary"></span>
                    <span class="font-semibold">Asesor sube Pagaré firmado</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_orden_firmada }}</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                    <span class="font-semibold">Asesor entrega Pagaré firmado fisico(facturador)</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_que_recibe_orden_firmada }}</span>
            </li>
            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <span class="inline-block h-3 w-3 rounded-full mr-2 bg-primary"></span>
                    <span class="font-semibold">Facturador entrega Pagaré firmado fisico(contabilidad)</span>
                </span>
                <span>{{ arregloTransabilidad.fecha_que_recibe_orden_firmada_contabilidad }}</span>
            </li>

            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <!-- Icono de verificación -->
                    <i class="fas fa-check-circle mr-2 text-danger"></i>
                    <span class="font-semibold">Evidencia de verificación</span>
                </span>
                <span>
                    <div v-for="(fecha, index) in arregloTransabilidad.fecha_subida_evidencia" :key="index">
                        <div>{{ 'Fecha ' + (index + 1) }}: {{ fecha }}</div>
                    </div>
                </span>
            </li>

            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <!-- Icono de factura -->
                    <i class="fas fa-file-invoice mr-2 text-warning"></i>
                    <span class="font-semibold">Facturas subidas</span>
                </span>
                <span>
                    <div v-for="(fecha, index) in arregloTransabilidad.fecha_subida_factura" :key="index">
                        <div>{{ 'Fecha ' + (index + 1) }}: {{ fecha }}</div>
                    </div>
                </span>
            </li>

            <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
                <span class="flex items-center">
                    <!-- Icono de revisión -->
                    <i class="fas fa-edit mr-2 text-primary"></i>
                    <span class="font-semibold">Evidencia de revisiones</span>
                </span>
                <span>
                    <div v-for="(fecha, index) in arregloTransabilidad.fecha_subida_revision" :key="index">
                        <div>{{ 'Fecha ' + (index + 1) }}: {{ fecha }}</div>
                    </div>
                </span>
            </li>

        </ul>
    </div>
</template>
<script>
export default{
    data(){
        return{
            arregloTransabilidad:[],
        }   
    },
    props:{
        pedido:{
            type:Object,
            default:{},
        },
    },
    mounted(){
        let me = this;
        me.getTransabilidad()
    },
    methods:{
        getTransabilidad(){
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url+'getTransabilidad/'+me.pedido.id_pedido)
                .then(function (res) {
                    me.arregloTransabilidad = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        }
    }

}
</script>