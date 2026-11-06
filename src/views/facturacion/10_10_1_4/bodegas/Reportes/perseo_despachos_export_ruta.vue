<template>
    <div>
        <h5 class="text-center font-bold">HOJA DE DESPACHO DIARIA</h5>
        <br>
        <p>Día de despacho: {{ fecha }}</p>

        <table class="tabla2" style="width:95%;border-collapse:collapse;border:none;font-size:11px;margin-top:15px;">
            <tbody v-for="(tr, key) in datosReporte" :key="key" style="border:2px solid #000000">
                <!-- Referencia -->
                <tr style="border:0.5px solid #333232">
                    <td colspan="2" style="text-align:left;padding:8px;border:0.5px solid #333232">
                        <b>Responsable:</b> {{ tr.chofer_nombre || '—' }}
                    </td>
                    <td colspan="4" style="text-align:start;padding:8px;border:0.5px solid #333232;">
                        <b>{{ tr.ven_codigo }}</b>
                    </td>
                    <!-- <td colspan="2" style="text-align:right;padding:8px;border:0.5px solid #333232"></td> -->
                </tr>
                <!-- Cliente / Destino -->
                <tr style="border:0.5px solid #333232">
                    <td colspan="6" style="text-align:justify;border:0.5px solid #333232">
                        <p><b>Institución:</b> {{ tr.nombreInstitucion }}</p>
                        <p><b>Cliente:</b> {{ tr.cliente_nombre || 'Sin cliente' }}</p>
                        <p><b>RUC / C.I.:</b> {{ tr.ruc }}</p>
                        <p><b>Teléfono:</b> {{ tr.telefono }}</p>
                        <p><b>Destino:</b> {{ tr.ciudad }} - {{ tr.direccion }}</p>
                    </td>
                </tr>
                <!-- Cabecera empaques -->
                <tr style="border:0.5px solid #333232">
                    <td style="border:0.5px solid #333232"><b>Empaques:</b></td>
                    <td style="border:0.5px solid #333232"><b>Caja grande</b></td>
                    <td style="border:0.5px solid #333232"><b>Caja pequeña</b></td>
                    <td style="border:0.5px solid #333232"><b>Paquete</b></td>
                    <td style="border:0.5px solid #333232"><b>TOTAL</b></td>
                </tr>
                <!-- Cantidades empaques -->
                <tr style="border:0.5px solid #333232">
                    <td style="border:0.5px solid #333232"><b>Cantidad:</b></td>
                    <td style="border:0.5px solid #333232">{{ tr.caja_grande || 0 }}</td>
                    <td style="border:0.5px solid #333232">{{ tr.caja_pequena || 0 }}</td>
                    <td style="border:0.5px solid #333232">{{ tr.paquete || 0 }}</td>
                    <td style="border:0.5px solid #333232">{{ (parseInt(tr.caja_grande)||0) + (parseInt(tr.caja_pequena)||0) + (parseInt(tr.paquete)||0) }}</td>
                </tr>
                <!-- Transporte + Guía -->
                <tr style="border:0.5px solid #333232">
                    <td colspan="3" style="text-align:justify;border:0.5px solid #333232">
                        <b>Empresa de Transporte:</b> {{ tr.trans_nombre }}
                    </td>
                    <td colspan="3" style="text-align:justify;border:0.5px solid #333232">
                        <b>N° de Guía:</b> {{ tr.guia_remision || '—' }}
                    </td>
                </tr>
                <!-- Observación + Fecha + Responsable -->
                <tr style="border:0.5px solid #333232">
                    <td colspan="6" style="text-align:justify;border:0.5px solid #333232">
                        <div v-if="tr.ven_observacion">
                            <b>Observación Facturador:</b> {{ tr.ven_observacion }}
                        </div>
                        <div v-if="tr.idtipodoc == 12 && tr.observacion_guia">
                            <b>Observación Asesor:</b> {{ tr.observacion_guia }}
                        </div>
                        <div v-if="tr.observacion_empacado">
                            <b>Observación Empacado:</b> {{ tr.observacion_empacado }}
                        </div>
                        <span v-if="!tr.ven_observacion && !(tr.idtipodoc == 12 && tr.observacion_guia) && !tr.observacion_empacado">—</span>
                    </td>
                </tr>
                <tr><td colspan="6"></td></tr>
                <tr><td colspan="6"></td></tr>
            </tbody>
        </table>

        <!-- Totales -->
        <table class="tabla2" style="width:95%;border-collapse:collapse;border:none;font-size:11px;margin-top:15px;">
            <tbody style="border:2px solid #000000">
                <tr style="border:0.5px solid #333232">
                    <th><b>Cantidad despachos #</b></th>
                    <th>Empaques:</th>
                    <th>Cajas grandes</th>
                    <th>Cajas pequeñas</th>
                    <th>Paquetes</th>
                    <th><b>TOTAL EMPAQUES</b></th>
                </tr>
                <tr style="border:0.5px solid #333232">
                    <td><b>{{ datosReporte.length }}</b></td>
                    <td>Cantidad:</td>
                    <td>{{ totalCajaGrande }}</td>
                    <td>{{ totalCajaPequena }}</td>
                    <td>{{ totalPaquete }}</td>
                    <td><b>{{ totalCajaGrande + totalCajaPequena + totalPaquete }}</b></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'PerseoDespachoExportRuta',
    props: {
        datos: { type: Array, default: () => [] }
    },
    data() {
        return {
            datosReporte: [],
            fecha: ''
        }
    },
    computed: {
        totalCajaGrande()  { return this.datosReporte.reduce(function(s, r) { return s + (parseInt(r.caja_grande)  || 0) }, 0) },
        totalCajaPequena() { return this.datosReporte.reduce(function(s, r) { return s + (parseInt(r.caja_pequena) || 0) }, 0) },
        totalPaquete()     { return this.datosReporte.reduce(function(s, r) { return s + (parseInt(r.paquete)      || 0) }, 0) }
    },
    mounted() {
        this.datosReporte = this.datos
        var d = new Date()
        this.fecha = d.getFullYear() + '-' +
            ('0' + (d.getMonth()+1)).slice(-2) + '-' +
            ('0' + d.getDate()).slice(-2) + ' ' +
            ('0' + d.getHours()).slice(-2) + ':' +
            ('0' + d.getMinutes()).slice(-2)
    }
}
</script>

<style scoped>
* { font-family: Arial; }
.tabla2 { width: 95%; border-collapse: collapse; border: none; font-size: 11px; margin-top: 15px; }
.encabezado, td, th { border: 1px solid rgb(39,39,39); text-align: center; border-spacing: 0; }
thead { border: 2px solid #000000; }
tr { border: 0.5px solid #333232; }
td { border: 0.5px solid #333232; }
tbody { border: 2px solid #000000; }
</style>
