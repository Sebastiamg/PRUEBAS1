<template>
<div>
    <!-- Botón imprimir -->
    <div style="display:flex; justify-content:center; margin: 16px 0; gap: 12px; flex-direction: column; align-items: center;">
        <vs-alert v-if="reporteListo && encabezado.tre_estado != '2' && encabezado.tre_estado != '0'" color="warning" active="true" style="max-width: 600px; text-align: center; margin-bottom: 10px;">
            <p><strong>¡Atención!</strong> Al hacer clic en "Imprimir / Descargar PDF", este reporte pasará a estado <b>Impreso</b> y ya no podrá ser editado.</p>
        </vs-alert>
        <div style="display:flex; justify-content:center; gap: 12px;">
            <vs-button
                v-if="encabezado.tre_estado != '0'"
                color="dark"
                type="line"
                icon-pack="feather"
                icon="icon-printer"
                :disabled="!reporteListo"
                @click="confirmarImpresion()"
            >
                Imprimir / Descargar PDF
            </vs-button>
            <vs-button
                v-if="encabezado.tre_estado == '0'"
                color="dark"
                type="line"
                icon-pack="feather"
                icon="icon-printer"
                :disabled="!reporteListo"
                @click="imprimirAnulado()"
            >
                Imprimir Reporte Anulado
            </vs-button>
            <vs-button color="danger" type="line" @click="getCancelar()">Cerrar</vs-button>
        </div>
    </div>

    <!-- Área de impresión -->
    <div id="seccionImprimir2" v-if="reporteListo">
        <!--
            Por cada solicitante se genera un bloque independiente.
            page-break-before: always garantiza que cada solicitante
            empiece en una página nueva (sin importar cuánto espacio
            quedó en la página anterior).
        -->
        <div v-for="(solicitante, idx) in solicitantesResueltos" :key="solicitante.idusuario" :style="idx > 0 ? 'page-break-before: always;' : ''">
            <!-- ENCABEZADO: Logo izq + Título centro -->
            <table width="100%" style="margin-bottom:10px; border-collapse:collapse;">
                <tr>
                    <td width="160" valign="middle" style="border:none; padding:0;">
                        <img v-if="logoBase64" :src="logoBase64" alt="Logo" style="max-width:150px; max-height:70px; object-fit:contain;" />
                    </td>
                    <td valign="middle" style="border:none; text-align:center; padding:0;">
                        <div style="font-size:16px; font-weight:bold; letter-spacing:1px;">REPORTE SEMANAL</div>
                        <!-- <div style="font-size:11px; color:#555; margin-top:2px;">PROLIPA - Talento Humano</div> -->
                    </td>
                    <td width="160" style="border:none;"></td>
                </tr>
            </table>

            <!-- TABLA DE DETALLES -->
            <table border="1" width="100%" style="border-collapse:collapse; font-size:10.5px; margin-bottom:16px;">
                <thead style="background:#f0f0f0;">
                    <tr>
                        <th style="padding:4px; text-align:center; width:30px;">N°</th>
                        <th style="padding:4px; text-align:center; width:90px;">FECHA</th>
                        <th style="padding:4px; text-align:center; width:80px;">DÍA</th>
                        <th style="padding:4px; text-align:center; width:60px;">ENTRADA</th>
                        <th style="padding:4px; text-align:center; width:60px;">SALIDA</th>
                        <th style="padding:4px; text-align:center; width:55px;">FERIADO</th>
                        <th style="padding:4px; text-align:center; width:55px;">CÁLCULO</th>
                        <th style="padding:4px; text-align:center; width:90px;">H. SUPLEMENTARIAS</th>
                        <th style="padding:4px; text-align:center; width:90px;">H. EXTRAORDINARIAS</th>
                        <th style="padding:4px; text-align:center;">ACTIVIDADES</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(fila, fi) in detalles" :key="fi">
                        <td style="padding:3px 5px; text-align:center; font-weight:bold;">{{ fi + 1 }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ fila.trd_fecha }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ getDia(fila.trd_fecha) }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ fila.trd_hora_entrada }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ fila.trd_hora_salida }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ fila.trd_es_feriado == '1' ? 'Sí' : 'No' }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ fila.trd_modo_calculo }}</td>
                        <td style="padding:3px 5px; text-align:center; color:#92400e; font-weight:bold;">{{ fila.trd_horas_suplementarias }}</td>
                        <td style="padding:3px 5px; text-align:center; color:#166534; font-weight:bold;">{{ fila.trd_horas_extraordinarias }}</td>
                        <td style="padding:3px 5px; text-align:left; white-space:pre-wrap;">{{ fila.trd_actividades }}</td>
                    </tr>
                    <!-- Fila de totales -->
                    <tr style="background:#e5e7eb; font-weight:bold;">
                        <td colspan="7" style="padding:4px 5px; text-align:right;">TOTAL HORAS EXTRA:</td>
                        <td style="padding:4px 5px; text-align:center; color:#92400e;">{{ totalSuplementariasStr }}</td>
                        <td style="padding:4px 5px; text-align:center; color:#166534;">{{ totalExtraordinariasStr }}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <!-- FIRMAS: 3 columnas unificadas para alineación perfecta y evitar saltos de página -->
            <div style="page-break-inside: avoid; margin-top: 30px;">
                <table width="100%" style="border-collapse:collapse; border:1px solid #ccc;">
                    <!-- TITULOS -->
                    <tr style="background:#f0f0f0; font-weight:bold; font-size:11px;">
                        <td width="33.3%" style="text-align:center; padding:5px; border:1px solid #ccc;">SOLICITADO POR:</td>
                        <td width="33.3%" style="text-align:center; padding:5px; border:1px solid #ccc;">AUTORIZADO POR:</td>
                        <td width="33.3%" style="text-align:center; padding:5px; border:1px solid #ccc;">APROBADO POR:</td>
                    </tr>
                    <!-- ESPACIO FIRMA -->
                    <tr>
                        <td style="height:55px; border:1px solid #ccc;"></td>
                        <td style="height:55px; border:1px solid #ccc;"></td>
                        <td style="height:55px; border:1px solid #ccc;"></td>
                    </tr>
                    <!-- NOMBRES -->
                    <tr style="font-size:11px; font-weight:bold;">
                        <td style="text-align:center; padding:6px; border:1px solid #ccc; vertical-align:middle;">
                            {{ solicitante.nombre_completo_display }}
                        </td>
                        <td style="text-align:center; padding:6px; border:1px solid #ccc; vertical-align:middle;">
                            {{ getNombreUsuario(encabezado.tre_autorizado_por) }}
                        </td>
                        <td style="text-align:center; padding:6px; border:1px solid #ccc; vertical-align:middle;">
                            {{ getNombreUsuario(encabezado.tre_aprobado_por) }}
                        </td>
                    </tr>
                    <!-- DEPARTAMENTOS -->
                    <tr style="font-size:11px; font-weight:bold; background:#f9f9f9;">
                        <td style="text-align:center; padding:5px; border:1px solid #ccc;">
                            {{ getNombreDepartamento(encabezado.tre_solicitado_departamento) }}
                        </td>
                        <td style="text-align:center; padding:5px; border:1px solid #ccc;">
                            {{ getNombreDepartamento(encabezado.tre_autorizado_departamento) }}
                        </td>
                        <td style="text-align:center; padding:5px; border:1px solid #ccc;">
                            {{ getNombreDepartamento(encabezado.tre_aprobado_departamento) }}
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div v-else style="text-align:center; padding: 60px; color:#aaa;">
        <p>Cargando datos del reporte...</p>
    </div>
</div>
</template>

<script>
import imprimirMixin from "@/mixins/Pedidosmix.js";

export default {
    mixins: [imprimirMixin],
    props: {
        tab_Reporte: {
            type: Object,
            default: function () {
                return {};
            }
        },
    },
    data() {
        return {
            logoBase64: null,
            detalles: [],
            encabezado: {},
            listaUsuarios: [],
            solicitantesResueltos: [],
            reporteListo: false,
            diasSemana: ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"],
            departamentos: {},
        };
    },
    computed: {
        totalSuplementariasStr() {
            const total = this.detalles.reduce((acc, d) => acc + this.timeToMinutes(d.trd_horas_suplementarias), 0);
            return this.minutesToStr(total);
        },
        totalExtraordinariasStr() {
            const total = this.detalles.reduce((acc, d) => acc + this.timeToMinutes(d.trd_horas_extraordinarias), 0);
            return this.minutesToStr(total);
        },
    },
    mounted() {
        Promise.all([
            this.cargarLogo(),
            this.cargarUsuarios(),
            this.cargarDepartamentos(),
            this.cargarDetalles(),
        ]).then(() => {
            this.encabezado = this.tab_Reporte;
            this.resolverSolicitantes();
            this.reporteListo = true;
        });
    },
    methods: {
        cargarLogo() {
            return this.$http.get(this.$server_url + 'VerifcarMetodosGet_ReportesSemanales?action=Get_LogoEmpresa')
                .then(res => {
                    this.logoBase64 = res.data.img_base64;
                })
                .catch(err => console.log(err));
        },
        cargarUsuarios() {
            return this.$http.get(this.$server_url + 'VerifcarMetodosGet_ReportesSemanales?action=Get_UsuariosGrupo36')
                .then(res => {
                    this.listaUsuarios = res.data;
                })
                .catch(err => console.log(err));
        },
        cargarDepartamentos() {
            return this.$http.get(this.$server_url + 'VerifcarMetodosGet_ReportesSemanales?action=Get_DepartamentosActivos')
                .then(res => {
                    this.departamentos = {};
                    res.data.forEach(d => {
                        this.departamentos[d.value] = d.label;
                    });
                })
                .catch(err => console.log(err));
        },
        cargarDetalles() {
            return this.$http.get(
                this.$server_url + 'VerifcarMetodosGet_ReportesSemanales?action=Get_DetalleReporteSemanal&tre_id=' + this.tab_Reporte.tre_id
            ).then(res => {
                this.detalles = res.data;
            }).catch(err => console.log(err));
        },
        resolverSolicitantes() {
            let ids = [];
            try {
                ids = JSON.parse(this.tab_Reporte.tre_solicitado_por);
                if (!Array.isArray(ids)) ids = [];
            } catch (e) {
                ids = [];
            }
            this.solicitantesResueltos = ids.map(id => {
                const u = this.listaUsuarios.find(x => x.idusuario == id);
                return {
                    idusuario: id,
                    nombre_completo_display: u ?
                        (u.nombres + ' ' + u.apellidos) :
                        'ID: ' + id,
                };
            });
            // Si no hay solicitantes, poner un placeholder
            if (this.solicitantesResueltos.length === 0) {
                this.solicitantesResueltos = [{
                    idusuario: 0,
                    nombre_completo_display: ''
                }];
            }
        },
        getNombreUsuario(id) {
            if (!id) return '';
            const u = this.listaUsuarios.find(x => x.idusuario == id);
            return u ? (u.nombres + ' ' + u.apellidos) : 'ID: ' + id;
        },
        getNombreDepartamento(val) {
            if (!val) return '';
            return this.departamentos[Number(val)] || val;
        },
        getDia(fecha) {
            if (!fecha) return '';
            const d = new Date(fecha + "T00:00:00");
            return this.diasSemana[d.getDay()];
        },
        timeToMinutes(t) {
            if (!t) return 0;
            const parts = String(t).split(':');
            if (parts.length < 2) return 0;
            return (Number(parts[0]) * 60) + Number(parts[1]);
        },
        minutesToStr(min) {
            if (!min || min <= 0) return "0:00";
            const h = Math.floor(min / 60);
            const m = min % 60;
            return `${h}:${m.toString().padStart(2, '0')}`;
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitimprimir: 2
            });
        },
        confirmarImpresion() {
            let me = this;
            if (me.encabezado.tre_estado == '2') {
                // Ya está impreso, solo imprimir sin cambiar estado
                me.m_imprimirTodos('11px', 'Reporte_Semanal', '1px', '', 'portrait');
                return;
            }
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `Confirmar Impresión`,
                text: '¿Está seguro de imprimir este reporte? Una vez impreso, pasará a estado "Impreso" y no se podrá editar.',
                acceptText: 'Sí, Imprimir',
                cancelText: 'Cancelar',
                accept: me.ejecutarImpresion
            })
        },
        imprimirAnulado() {
            let me = this;
            me.m_imprimirTodos('11px', 'Reporte_Semanal', '1px', 'ANULADO', 'portrait');
        },
        ejecutarImpresion() {
            let me = this;
            me.$vs.loading();

            let formData = new FormData();
            formData.append('action', 'CambiarEstadoImpreso_ReportesSemanales');
            formData.append('tre_id', me.tab_Reporte.tre_id);

            me.$http.post(me.$server_url + 'VerifcarMetodosPost_ReportesSemanales', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status === 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        // Cambiar el estado localmente
                        me.encabezado.tre_estado = '2';
                        // Ejecutar la impresión
                        me.m_imprimirTodos('11px', 'Reporte_Semanal', '1px', '', 'portrait');
                        // Emitimos para que la tabla padre sepa que se imprimió y debe actualizarse
                        me.$emit('change', {
                            verificacionemitimprimir: 1
                        });
                    } else {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al cambiar de estado',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                });
        },
    },
};
</script>

<style scoped>
</style>
