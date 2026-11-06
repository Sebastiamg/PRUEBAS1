<template>
    <div>
        <!-- Botón de imprimir -->
        <div style="display: flex; justify-content: center; margin-top: 10px;">
            <vs-button 
                @click="imprimirPDF()" 
                color="primary" 
                icon-pack="feather" 
                icon="icon-printer">
                Imprimir PDF
            </vs-button>
        </div>

        <!-- Contenido para imprimir -->
        <vx-card id="seccionImprimir2" v-if="datosListos">
            <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
            <p class="text-center font-bold" style="font-size: 15px;">DETALLE DE PEDIDO LIBROS HIJOS DOCENTES/OBSEQUIOS</p>
            
            <p class="text-center font-bold" style="font-size: 15px;">Pedido #{{ librosObsequios.id }}</p>

            <p style="margin-left: 35px; font-size: 11px;"><b>Fecha:</b> {{ librosObsequios.created_at }}</p>
            
            <table >
                <tr>
                    <td style="width: 150px;">
                        <p style="margin-left: 35px; font-size: 11px;"><b>INSTITUCIÓN:</b></p>
                    </td>
                    <td>
                        <p style="font-size: 11px;">{{ librosObsequios.nombreInstitucion }}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p style="margin-left: 35px; font-size: 11px;"><b>CONTRATO:</b></p>
                    </td>
                    <td>
                        <p style="font-size: 11px;">{{ librosObsequios.contrato_generado }}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p style="margin-left: 35px; font-size: 11px;"><b>CREADO POR:</b></p>
                    </td>
                    <td>
                        <p style="font-size: 11px;">{{ librosObsequios.creador }}</p>
                    </td>
                </tr>
                <tr v-if="librosObsequios.observacion_asesor">
                    <td>
                        <p style="margin-left: 35px; font-size: 11px;"><b>OBSERVACIÓN:</b></p>
                    </td>
                    <td>
                        <p style="font-size: 11px;">{{ librosObsequios.observacion_asesor }}</p>
                    </td>
                </tr>
            </table>
            <p style="font-size: 11px; align-items:center;text-align:center">
                Detalle de los libros solicitados para hijos de docentes:
            </p>
            <table style="width: 90%; margin-left: 35px; font-size: 11px; margin-top: 15px; border: 1px">
                <thead>
                    <tr>
                        <td style="text-align: center; padding: 8px; background-color: #f5f5f5;"><b>CÓDIGO</b></td>
                        <td style="text-align: center; padding: 8px; background-color: #f5f5f5;"><b>LIBRO</b></td>
                        <td style="text-align: center; padding: 8px; background-color: #f5f5f5;"><b>PRECIO UNIT.</b></td>
                        <td style="text-align: center; padding: 8px; background-color: #f5f5f5;"><b>CANTIDAD</b></td>
                        <td style="text-align: center; padding: 8px; background-color: #f5f5f5;"><b>SUBTOTAL</b></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(libro, key) in arregloLibros" :key="key">
                        <td style="text-align: center; padding: 6px;">{{ libro.pro_codigo }}</td>
                        <td style="text-align: left; padding: 6px;">
                            {{ libro.pro_nombre }}
                            <span v-if="libro.id_serie === 19" style="font-size: 10px; display: block; margin-top: 4px;">
                                <b>Combo:</b> {{ libro.descripcionlibro }}
                            </span>
                        </td>
                        <td style="text-align: center; padding: 6px;">${{ parseFloat(libro.p_libros_valor_u).toFixed(2) }}</td>
                        <td style="text-align: center; padding: 6px;">{{ libro.p_libros_cantidad }}</td>
                        <td style="text-align: center; padding: 6px;">${{ (parseFloat(libro.p_libros_valor_u) * parseInt(libro.p_libros_cantidad)).toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-left: 35px; width: 90%;">
                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: right; padding-right: 20px; width: 70%;">
                            <p style="font-size: 11px;"><b>SUBTOTAL:</b></p>
                        </td>
                        <td style="text-align: right;">
                            <p style="font-size: 11px;">${{ subtotal.toFixed(2) }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-right: 20px;">
                            <p style="font-size: 11px;"><b>DESCUENTO ({{ porcentaje_descuento }}%):</b></p>
                        </td>
                        <td style="text-align: right;">
                            <p style="font-size: 11px;">${{ descuento.toFixed(2) }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-right: 20px;">
                            <p style="font-size: 11px;"><b>TOTAL:</b></p>
                        </td>
                        <td style="text-align: right;">
                            <p style="font-size: 11px;"><b>${{ total.toFixed(2) }}</b></p>
                        </td>
                    </tr>
                </table>
            </div>
            <div style="margin-left: 35px;">
                <p style="font-size: 11px;"><b>Total de unidades:</b> {{ totalUnidades }}</p>
            </div>

        </vx-card>
    </div>
</template>
<script>
import html2pdf from "html2pdf.js";

export default{
    data(){
        return{
            arregloLibros:[],
            porcentaje_descuento:'',
            nombreEmpresaActual: '',
            datosListos: false,
            subtotal: 0,
            descuento: 0,
            total: 0,
            totalUnidades: 0
        }
    },
    props:{
        librosObsequios:{
            type:Object,
            default:{},
        }
    },
    mounted(){
        let me = this;
        me.empresaActual();
        me.getLibros();
    },
    methods:{
        async empresaActual() {
            await this.$http.get(this.$server_url + 'empresaActual')
                .then(res => {
                    this.nombreEmpresaActual = res.data[0].descripcion_corta;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        
        getLibros(){
            let me = this
            this.$vs.loading();
            this.$http.get(this.$server_url+'obtenerDatosDetalleLibros/'+me.librosObsequios.id)
            .then(res => {
                let datos = res.data
                me.arregloLibros = datos
                me.porcentaje_descuento = me.arregloLibros[0].porcentaje_descuento
                me.calcularTotales();
                me.datosListos = true;
                this.$vs.loading.close();
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },

        calcularTotales() {
            let me = this;
            me.subtotal = 0;
            me.totalUnidades = 0;

            me.arregloLibros.forEach(libro => {
                const precio = parseFloat(libro.p_libros_valor_u);
                const cantidad = parseInt(libro.p_libros_cantidad);
                me.subtotal += precio * cantidad;
                me.totalUnidades += cantidad;
            });

            const porcentajeDescuento = parseFloat(me.porcentaje_descuento) || 0;
            me.descuento = (me.subtotal * porcentajeDescuento) / 100;
            me.total = me.subtotal - me.descuento;
        },

        imprimirPDF() {
            let me = this;
            var element = document.getElementById('seccionImprimir2');
            
            var opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `Detalle_Pedido_LibrosObsequios_${me.librosObsequios.id}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    logging: false
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'],
                    avoid: ['tr', 'td', 'th']
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'letter', 
                    orientation: 'portrait' 
                }
            };
            
            html2pdf().from(element).set(opt).save();
            
            me.$vs.notify({
                text: 'PDF generado correctamente',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
            });
        },
    }
}
</script>

