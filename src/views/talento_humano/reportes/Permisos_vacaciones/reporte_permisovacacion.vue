<template>
<div>
    <div style="display:flex; justify-content:center; margin: 16px 0; gap: 12px; flex-direction: column; align-items: center;">
        <vs-alert v-if="reporteListo && encabezado.tpe_estado != '2' && encabezado.tpe_estado != '0'" color="warning" active="true" style="max-width: 600px; text-align: center; margin-bottom: 10px;">
            <p><strong>¡Atención!</strong> Al hacer clic en "Imprimir / Descargar PDF", esta solicitud pasará a estado <b>Impreso</b> y ya no podrá ser editada.</p>
        </vs-alert>
        <div style="display:flex; justify-content:center; gap: 12px;">
            <vs-button
                v-if="encabezado.tpe_estado != '0'"
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
                v-if="encabezado.tpe_estado == '0'"
                color="dark"
                type="line"
                icon-pack="feather"
                icon="icon-printer"
                :disabled="!reporteListo"
                @click="imprimirAnulado()"
            >
                Imprimir Solicitud Anulada
            </vs-button>
            <vs-button color="danger" type="line" @click="getCancelar()">Cerrar</vs-button>
        </div>
    </div>

    <div id="seccionImprimir2" v-if="reporteListo">
        <!-- ENCABEZADO -->
        <table width="100%" style="margin-bottom:10px; border-collapse:collapse;">
            <tr>
                <td width="160" valign="middle" style="border:none; padding:0;">
                    <img v-if="logoBase64" :src="logoBase64" alt="Logo" style="max-width:150px; max-height:70px; object-fit:contain;" />
                </td>
                <td valign="middle" style="border:none; text-align:center; padding:0;">
                    <div style="font-size:16px; font-weight:bold; letter-spacing:1px;">SOLICITUD DE PERMISO O VACACIONES</div>
                    <!-- <div style="font-size:11px; color:#555; margin-top:2px;">PROLIPA - Talento Humano</div> -->
                </td>
                <td width="160" style="border:none;"></td>
            </tr>
        </table>

        <!-- TIPO Y SUBTIPO -->
        <table border="1" width="100%" style="border-collapse:collapse; font-size:11px; margin-bottom:10px;">
            <tr style="background:#f0f0f0;">
                <td style="padding:5px 8px; font-weight:bold; width:30%;">TIPO DE SOLICITUD:</td>
                <td style="padding:5px 8px;">{{ encabezado.tpe_tipo_solicitud === '0' ? 'PERMISO' : 'VACACIÓN' }}</td>
                <td style="padding:5px 8px; font-weight:bold; width:20%;" v-if="encabezado.tpe_tipo_solicitud === '0'">CAUSA:</td>
                <td style="padding:5px 8px;" v-if="encabezado.tpe_tipo_solicitud === '0'">{{ resolverSubtipo() }}</td>
            </tr>
            <tr v-if="encabezado.tpe_tipo_solicitud === '0' && encabezado.tpe_subtipo_permiso === '5' && encabezado.tpe_p_causa_otro">
                <td style="padding:5px 8px; font-weight:bold;">OTRA CAUSA:</td>
                <td colspan="3" style="padding:5px 8px;">{{ encabezado.tpe_p_causa_otro }}</td>
            </tr>
        </table>

        <!-- DETALLE según tipo/subtipo -->

        <!-- VACACIÓN -->
        <div v-if="encabezado.tpe_tipo_solicitud === '1'" style="margin-bottom:12px; font-size:13px; line-height:2;">
            <p>
                Autorizamos al Sr.(a) <strong>{{ (detalles[0] && detalles[0].tpd_v_nombre_empleado) || tpe_solicitado_nombre }}</strong>,
                para que haga uso de sus vacaciones de
                <strong>{{ (detalles[0] && detalles[0].tpd_v_total_dias) || encabezado.tpe_p_v_total_dias || '___' }}</strong> días que tiene derecho,
                de acuerdo a las disposiciones del Código de Trabajo,
                desde <strong>{{ formatFecha(detalles[0] && detalles[0].tpd_v_fecha_desde) || '___' }}</strong>
                hasta <strong>{{ formatFecha(detalles[0] && detalles[0].tpd_v_fecha_hasta) || '___' }}</strong>.
            </p>
            <p>Estas vacaciones se aplican al período de trabajo: <strong>{{ detalles[0] && detalles[0].tpd_v_periodo || '___' }}</strong></p>
            <p>Saldo de vacaciones pendientes: <strong>{{ detalles[0] && detalles[0].tpd_v_saldo_pendiente || '___' }}</strong> días</p>
            <div v-if="detalles[0] && detalles[0].tpd_v_observaciones" style="margin-top:8px;">
                <strong>Observaciones:</strong><br>{{ detalles[0].tpd_v_observaciones }}
            </div>
        </div>

        <!-- PERMISO CARGO A VACACIONES (subtipo '2') -->
        <div v-else-if="encabezado.tpe_tipo_solicitud === '0' && encabezado.tpe_subtipo_permiso == '2'" style="margin-bottom:12px;">
            <p style="font-size:12px; margin-bottom:6px; font-weight:bold;">Fechas a cargo de vacaciones (Total: {{ encabezado.tpe_p_v_total_dias || detalles.length }} días):</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px; padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
                <span v-for="(d, i) in detalles" :key="i"
                    style="background:#dbeafe; border:1px solid #93c5fd; border-radius:12px; padding:3px 10px; font-size:12px;">
                    {{ formatFecha(d.tpd_p_fecha) }}
                </span>
                <span v-if="detalles.length === 0" style="color:#94a3b8; font-size:12px;">Sin fechas registradas</span>
            </div>
        </div>

        <!-- PERMISO INSTITUCIONAL (subtipo '3') -->
        <div v-else-if="encabezado.tpe_tipo_solicitud === '0' && encabezado.tpe_subtipo_permiso == '3'" style="margin-bottom:12px;">
            <table border="1" width="100%" style="border-collapse:collapse; font-size:10.5px;">
                <thead style="background:#f0f0f0;">
                    <tr>
                        <th style="padding:4px;">N°</th>
                        <th style="padding:4px;">Día</th>
                        <th style="padding:4px;">Fecha</th>
                        <th style="padding:4px;">Hora Salida</th>
                        <th style="padding:4px;">Hora Entrada</th>
                        <th style="padding:4px;">Actividad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(d, i) in detalles" :key="i">
                        <td style="padding:3px 5px; text-align:center;">{{ i + 1 }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ getDia(d.tpd_p_fecha) }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ formatFecha(d.tpd_p_fecha) }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ d.tpd_p_hora_salida }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ d.tpd_p_hora_entrada }}</td>
                        <td style="padding:3px 5px; white-space:pre-wrap;">{{ d.tpd_p_actividad }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="encabezado.tpe_p_v_obs_general" style="margin-top:8px; font-size:12px; padding:6px 8px; background:#f8fafc; border-left:3px solid #6366f1;">
                <strong>Observaciones:</strong> {{ encabezado.tpe_p_v_obs_general }}
            </div>
        </div>

        <!-- PERMISOS SIMPLES (Calamidad / Citas médicas / Otro — subtipos 0, 1, 2) -->
        <div v-else-if="encabezado.tpe_tipo_solicitud === '0'" style="margin-bottom:12px;">
            <table border="1" width="100%" style="border-collapse:collapse; font-size:10.5px;">
                <thead style="background:#f0f0f0;">
                    <tr>
                        <th style="padding:4px;">N°</th>
                        <th style="padding:4px;">Día</th>
                        <th style="padding:4px;">Fecha</th>
                        <th style="padding:4px;">Hora Salida</th>
                        <th style="padding:4px;">Hora Entrada</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(d, i) in detalles" :key="i">
                        <td style="padding:3px 5px; text-align:center;">{{ i + 1 }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ getDia(d.tpd_p_fecha) }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ formatFecha(d.tpd_p_fecha) }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ d.tpd_p_hora_salida }}</td>
                        <td style="padding:3px 5px; text-align:center;">{{ d.tpd_p_hora_entrada }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="encabezado.tpe_p_v_obs_general" style="margin-top:8px; font-size:12px; padding:6px 8px; background:#f8fafc; border-left:3px solid #6366f1;">
                <strong>Observaciones:</strong> {{ encabezado.tpe_p_v_obs_general }}
            </div>
        </div>

        <!-- FIRMAS -->
        <!-- FIRMAS: 3 columnas unificadas para alineación perfecta y evitar saltos de página -->
        <div style="page-break-inside: avoid; margin-top: 30px;">
            <table width="100%" style="border-collapse:collapse; border:1px solid #ccc;">
                <!-- TITULOS -->
                <tr style="background:#f0f0f0; font-weight:bold; font-size:11px;">
                    <td width="33.3%" style="text-align:center; padding:5px; border:1px solid #ccc;">SOLICITADO POR:</td>
                    <td width="33.3%" style="text-align:center; padding:5px; border:1px solid #ccc;">AUTORIZADO POR:</td>
                    <td width="33.3%" style="text-align:center; padding:5px; border:1px solid #ccc;">REGISTRADO POR:</td>
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
                        {{ tpe_solicitado_nombre }}
                    </td>
                    <td style="text-align:center; padding:6px; border:1px solid #ccc; vertical-align:middle;">
                        {{ getNombreUsuario(encabezado.tpe_autorizado_por) }}
                    </td>
                    <td style="text-align:center; padding:6px; border:1px solid #ccc; vertical-align:middle;">
                        {{ getNombreUsuario(encabezado.tpe_registrado_por) }}
                    </td>
                </tr>
                <!-- DEPARTAMENTOS -->
                <tr style="font-size:11px; font-weight:bold; background:#f9f9f9;">
                    <td style="text-align:center; padding:5px; border:1px solid #ccc;">
                        {{ getNombreDepartamento(encabezado.tpe_solicitado_departamento) }}
                    </td>
                    <td style="text-align:center; padding:5px; border:1px solid #ccc;">
                        {{ getNombreDepartamento(encabezado.tpe_autorizado_departamento) }}
                    </td>
                    <td style="text-align:center; padding:5px; border:1px solid #ccc;">
                        {{ getNombreDepartamento(encabezado.tpe_registrado_departamento) }}
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div v-else style="text-align:center; padding:60px; color:#aaa;">
        <p>Cargando datos del reporte...</p>
    </div>
</div>
</template>

<script>
import imprimirMixin from "@/mixins/Pedidosmix.js";

export default {
    mixins: [imprimirMixin],
    props: {
        tab_Permiso: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            logoBase64: null,
            detalles: [],
            encabezado: {},
            listaUsuarios: [],
            departamentos: [],
            reporteListo: false,
            diasSemana: ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"],
        };
    },
    computed: {
        tpe_solicitado_nombre() {
            if (!this.encabezado.tpe_solicitado_por) return '';
            const u = this.listaUsuarios.find(x => x.idusuario == this.encabezado.tpe_solicitado_por);
            return u ? (u.nombres + ' ' + u.apellidos) : ('ID: ' + this.encabezado.tpe_solicitado_por);
        },
    },
    mounted() {
        Promise.all([
            this.cargarLogo(),
            this.cargarUsuarios(),
            this.cargarDepartamentos(),
            this.cargarDetalles(),
        ]).then(() => {
            this.encabezado = { ...this.tab_Permiso };
            this.reporteListo = true;
        });
    },
    methods: {
        cargarLogo() {
            return this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos?action=Get_LogoEmpresa')
                .then(res => { this.logoBase64 = res.data.img_base64; })
                .catch(err => console.log(err));
        },
        cargarUsuarios() {
            return this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos?action=Get_UsuariosGrupo36')
                .then(res => { this.listaUsuarios = res.data; })
                .catch(err => console.log(err));
        },
        cargarDepartamentos() {
            return this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos?action=Get_DepartamentosActivos')
                .then(res => {
                    this.departamentos = {};
                    res.data.forEach(d => { this.departamentos[d.value] = d.label; });
                }).catch(err => console.log(err));
        },
        cargarDetalles() {
            return this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos?action=Get_DetallePermiso&tpe_id=' + this.tab_Permiso.tpe_id)
                .then(res => { this.detalles = res.data; })
                .catch(err => console.log(err));
        },
        getNombreUsuario(id) {
            if (!id) return '';
            const u = this.listaUsuarios.find(x => x.idusuario == id);
            return u ? (u.nombres + ' ' + u.apellidos) : ('ID: ' + id);
        },
        getNombreDepartamento(val) {
            if (!val) return '';
            return this.departamentos[Number(val)] || val;
        },
        getDia(fecha) {
            if (!fecha) return '';
            return this.diasSemana[new Date(fecha + 'T00:00:00').getDay()];
        },
        formatFecha(fecha) {
            if (!fecha) return '';
            const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
            const [anio, mes, dia] = fecha.split('-');
            if (!anio || !mes || !dia) return fecha;
            return `${anio}-${meses[parseInt(mes, 10) - 1]}-${dia}`;
        },
        resolverSubtipo() {
            const map = { '0': 'Calamidad Doméstica', '1': 'Citas Médicas', '2': 'Cargo a vacaciones', '3': 'Permiso Institucional', '4': 'Asuntos Personales', '5': 'Otro' };
            return map[this.encabezado.tpe_subtipo_permiso] || this.encabezado.tpe_subtipo_permiso || '-';
        },
        getCancelar() { this.$emit('change', { verificacionemitimprimir: 2 }); },
        confirmarImpresion() {
            let me = this;
            if (me.encabezado.tpe_estado == '2') {
                me.m_imprimirTodos('11px', 'Solicitud_Permiso', '1px', '', 'portrait');
                return;
            }
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `Confirmar Impresión`,
                text: '¿Está seguro de imprimir esta solicitud? Una vez impresa, pasará a estado "Impreso" y no se podrá editar.',
                acceptText: 'Sí, Imprimir',
                cancelText: 'Cancelar',
                accept: me.ejecutarImpresion
            })
        },
        imprimirAnulado() {
            let me = this;
            me.m_imprimirTodos('11px', 'Solicitud_Permiso', '1px', 'ANULADO', 'portrait');
        },
        ejecutarImpresion() {
            let me = this;
            me.$vs.loading();

            let formData = new FormData();
            formData.append('action', 'CambiarEstadoImpreso_PermisosVacaciones');
            formData.append('tpe_id', me.tab_Permiso.tpe_id);

            me.$http.post(me.$server_url + 'VerifcarMetodosPost_Permisos', formData)
            .then(res => {
                me.$vs.loading.close();
                if (res.data.status === 1) {
                    me.$vs.notify({ text: res.data.message, color: 'success', iconPack: 'feather', icon: 'icon-check' });
                    me.encabezado.tpe_estado = '2';
                    me.m_imprimirTodos('11px', 'Solicitud_Permiso', '1px', '', 'portrait');
                    me.$emit('change', { verificacionemitimprimir: 1 });
                } else {
                    me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                }
            })
            .catch(err => {
                console.log(err);
                me.$vs.loading.close();
                me.$vs.notify({ text: 'Error al cambiar de estado', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
            });
        },
    },
};
</script>
<style scoped></style>
