<template>
<vx-card fixed-height="true">
    <div>
        <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditar_Permiso(); verificarcrear_actualizar = 'create'">Registrar Nueva Solicitud</vs-button>
        <!-- <vs-button color="dark" type="border" icon="info" @click="getInformacion_Permiso()" style="float: right" title="Información">Información</vs-button> -->
    </div>

    <!-- PANEL INFORMATIVO DE ENTREGA -->
    <div class="info-entrega-container">
        <div class="info-card-premium">
            <div class="info-header">
                <div class="info-icon-box">
                    <span class="info-emoji">📄</span>
                </div>
                <div class="info-text">
                    <h3 class="info-title">Procedimiento de Solicitud</h3>
                    <p class="info-subtitle">Siga estos pasos para completar su trámite de permisos o vacaciones.</p>
                </div>
            </div>
            <div class="info-steps-grid">
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <span class="step-label">Registro</span>
                        <p class="step-desc">El colaborador de Prolipa registra la solicitud en el sistema.</p>
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <span class="step-label">Impresión</span>
                        <p class="step-desc">Se debe imprimir la solicitud para obtener las firmas físicas.</p>
                    </div>
                </div>
                <div class="step-item highlight">
                    <div class="step-number highlight-num">3</div>
                    <div class="step-content">
                        <span class="step-label">Entrega a TALENTO HUMANO</span>
                        <p class="step-desc">La solicitud firmada debe entregarse a Talento Humano <b>antes de salir</b> al permiso ó vacación.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filtro por departamento solo para userRoot -->
    <div v-if="userRoot" style="margin: 10px 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <label style="font-weight:600; font-size:13px;">Filtrar por Jefe de Área (Creador):</label>
        <v-select
            v-model="filtroDepartamento"
            :options="departamentos"
            :reduce="d => d.value"
            label="label"
            placeholder="-- Todos los jefes --"
            style="min-width:230px; font-size:13px;"
            @input="getConteo_Permisos()"
        />
        <vs-button v-if="filtroDepartamento" color="warning" type="flat" size="small" @click="filtroDepartamento = null; getConteo_Permisos()">Limpiar filtro</vs-button>
    </div>

    <vs-row>
        <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
            <vs-table ref="table" pagination :max-items="registrosmaximos" :data="Array_Permisos" noDataText="No hay registros de Permisos / Vacaciones" search>
                <template slot="header">
                    <vs-chip v-if="Array_Permisos" color="primary">Cantidad: <b> {{ Array_Permisos.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th sort-key="tpe_id">{{ isRouteTalentoHumano ? '#' : 'Código' }}</vs-th>
                    <vs-th sort-key="tpe_solicitado_por_display">Solicitado por</vs-th>
                    <vs-th>Autorizado por</vs-th>
                    <vs-th>Tipo</vs-th>
                    <vs-th>Subtipo</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Seguimiento</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td v-if="!isRouteTalentoHumano" :data="tr.tpe_id">{{ tr.tpe_id }}</vs-td>
                        <vs-td v-else><b>{{ Array_Permisos.length - Array_Permisos.indexOf(tr) }}</b></vs-td>
                        <vs-td>
                            <span>{{ tr.tpe_solicitado_por_display }}</span><br>
                            <small class="dept-tag">{{ tr.tpe_solicitado_departamento_display }}</small>
                        </vs-td>
                        <vs-td>
                            <span>{{ tr.tpe_autorizado_por_display }}</span><br>
                            <small class="dept-tag">{{ tr.tpe_autorizado_departamento_display }}</small>
                        </vs-td>
                        <vs-td>
                            <vs-chip :color="tr.tpe_tipo_solicitud === '0' ? 'primary' : 'warning'">
                                {{ tr.tpe_tipo_solicitud === '0' ? 'Permiso' : 'Vacación' }}
                            </vs-chip>
                        </vs-td>
                        <vs-td>{{ resolverSubtipo(tr.tpe_tipo_solicitud, tr.tpe_subtipo_permiso) }}</vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.tpe_estado == '1'" color="success">Activo</vs-chip>
                            <vs-chip v-else-if="tr.tpe_estado == '0'" color="danger">Anulado</vs-chip>
                            <vs-chip v-else-if="tr.tpe_estado == '2'" color="warning">Impreso</vs-chip>
                        </vs-td>
                        <vs-td>
                            <small><b>Creación:</b><br> {{tr.created_at}} ({{ tr.name_created_by }})</small>
                            <br>
                            <small><b>Modificación:</b><br> {{tr.updated_at}} ({{ tr.name_updated_by }})</small>
                        </vs-td>
                        <vs-td :data="data[indextr].tpe_id">
                            <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                <vs-dropdown-menu style="width: 250px;" class="cursor">
                                    <vs-dropdown-item>
                                        <vs-button v-if="tr.tpe_estado == '1'" color="#28C76F" type="line" class="w-full" @click="getNuevoEditar_Permiso(tr); verificarcrear_actualizar = 'update'">Editar</vs-button>
                                        <vs-button v-if="userRoot" color="#EA5455" type="line" class="w-full" @click="getEliminar_Permiso(tr)">Eliminar</vs-button>
                                        <vs-button v-if="tr.tpe_estado == '1' || tr.tpe_estado == '2'" color="#EA5455" type="line" class="w-full" @click="getActivarDesactivar_Permiso(tr)">
                                            Anular Solicitud
                                        </vs-button>
                                        <vs-button v-if="tr.tpe_estado == '0' && userRoot" color="#28C76F" type="line" class="w-full" @click="getActivarDesactivar_Permiso(tr)">
                                            Reactivar Solicitud
                                        </vs-button>
                                        <vs-button v-if="tr.tpe_estado == '2' && userRoot" color="#FF9F43" type="line" class="w-full" @click="reactivarEdicion(tr)">Reactivar Edición</vs-button>
                                        <vs-button color="#7367F0" type="line" icon-pack="feather" icon="icon-printer" class="w-full" @click="getImprimir_Permiso(tr)">Ver / Imprimir</vs-button>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-col>
    </vs-row>

    <!-- POPUP REGISTRO / EDICIÓN -->
    <vs-popup class="informacionformhijo" @close="getConteo_Permisos();" :title="verificarcrear_actualizar === 'create' ? 'Registrar Nueva Solicitud de Permiso / Vacaciones' : `Actualizar solicitud #${tab_Permiso.tpe_id || ''}`" :active.sync="popupGuardarEditar_Permiso" fullscreen>
        <Nuevo_Edit_Permiso v-if="popupGuardarEditar_Permiso" :verificarcrear_actualizar="verificarcrear_actualizar" :tab_Permiso="tab_Permiso" @change="changeHandleNuevoEditar_Permiso" />
    </vs-popup>

    <!-- POPUP ELIMINAR -->
    <vs-popup title="Eliminar Solicitud" :active.sync="popupActivoEliminar_Permiso">
        <Eliminar_Permiso v-if="popupActivoEliminar_Permiso" :tab_Permiso="tab_Permiso" @change="changeHandleEliminar_Permiso" />
    </vs-popup>

    <!-- POPUP ACTIVAR/DESACTIVAR -->
    <vs-popup :title="(tab_Permiso && (tab_Permiso.tpe_estado == '1' || tab_Permiso.tpe_estado == '2')) ? '¿Anular la solicitud?' : '¿Reactivar la solicitud?'" :active.sync="popupActivoDesactivar_Permiso">
        <ActivarDesactivar_Permiso v-if="popupActivoDesactivar_Permiso" :tab_Permiso="tab_Permiso" @change="changeHandleActivar_Desactivar_Permiso" />
    </vs-popup>

    <!-- POPUP INFORMACIÓN -->
    <vs-popup class="informacionformhijo" title="Información" :active.sync="popupInformacion_Permiso">
        <Informacion_Permiso v-if="popupInformacion_Permiso" :userRoot="userRoot" @change="changeHandleInformacion_Permiso" />
    </vs-popup>

    <!-- POPUP IMPRIMIR -->
    <vs-popup title="Imprimir Solicitud de Permiso / Vacaciones" class="informacionformhijo" :active.sync="popupImprimir_Permiso" fullscreen>
        <Reporte_Permiso v-if="popupImprimir_Permiso" :tab_Permiso="tab_Permiso" @change="changeHandleImprimir_Permiso" />
    </vs-popup>
</vx-card>
</template>

<script>
import { mapState } from "vuex";
import vSelect from 'vue-select';

const Nuevo_Edit_Permiso        = () => import("@/views/talento_humano/reportes/Permisos_vacaciones/registro_edicion_permisovacacion.vue");
const Eliminar_Permiso          = () => import("@/views/talento_humano/reportes/Permisos_vacaciones/eliminar_permisovacacion.vue");
const ActivarDesactivar_Permiso = () => import("@/views/talento_humano/reportes/Permisos_vacaciones/activar_desactivar_permisovacacion.vue");
const Informacion_Permiso       = () => import("@/views/talento_humano/reportes/Permisos_vacaciones/informacion_permisovacacion.vue");
const Reporte_Permiso           = () => import("@/views/talento_humano/reportes/Permisos_vacaciones/reporte_permisovacacion.vue");

export default {
    components: {
        'v-select': vSelect,
        Nuevo_Edit_Permiso,
        Eliminar_Permiso,
        ActivarDesactivar_Permiso,
        Informacion_Permiso,
        Reporte_Permiso,
    },
    data() {
        return {
            Array_Permisos: [],
            tab_Permiso: {},
            verificarcrear_actualizar: 'create',
            popupGuardarEditar_Permiso: false,
            popupActivoEliminar_Permiso: false,
            popupActivoDesactivar_Permiso: false,
            popupInformacion_Permiso: false,
            popupImprimir_Permiso: false,
            registrosmaximos: 50,
            departamentos: [],
            filtroDepartamento: null,
            isRouteTalentoHumano: false,
        };
    },
    mounted() {
        this.getConteo_Permisos();
        this.getDepartamentosActivos();
        let currentPath = this.$route.path;
        this.isRouteTalentoHumano = currentPath.includes('/talento-humano/reportes');
    },
    watch: {
        userRoot() {
            this.getConteo_Permisos();
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        usuarioActual() {
            try {
                let currentPath = this.$route.path;
                if (currentPath.includes('/reportes_talento_humano')) {
                    return JSON.parse(localStorage.getItem('usuario')) || {};
                } else if (currentPath.includes('/talento-humano/reportes')) {
                    return JSON.parse(localStorage.getItem('userProlipa')) || {};
                }

                const userPlatform = JSON.parse(localStorage.getItem('usuario'));
                if (userPlatform) return userPlatform;

                const userProlipa = JSON.parse(localStorage.getItem('userProlipa'));
                if (userProlipa) return userProlipa;

                return {};
            } catch (e) { return {}; }
        },
    },
    methods: {
        getDepartamentosActivos() {
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos?action=Get_JefesDepartamento')
                .then(res => { this.departamentos = res.data; })
                .catch(err => console.log(err));
        },
        getConteo_Permisos() {
            let me = this;
            me.$vs.loading();

            if (me.userRoot) {
                const params = { action: 'Get_Permisos' };
                if (me.filtroDepartamento) params.departamento = me.filtroDepartamento;

                me.$http.get(me.$server_url + 'VerifcarMetodosGet_Permisos', { params })
                    .then(res => {
                        me.Array_Permisos = res.data || [];
                        me.$vs.loading.close();
                    })
                    .catch(err => { console.log(err); me.$vs.loading.close(); });
            } else {
                const idusuario = me.usuarioActual.idusuario;
                me.$http.get(me.$server_url + 'VerifcarMetodosGet_Permisos', {
                    params: { action: 'Get_Permisos_xCreado', idusuario }
                })
                    .then(res => {
                        me.Array_Permisos = res.data || [];
                        me.$vs.loading.close();
                    })
                    .catch(err => { console.log(err); me.$vs.loading.close(); });
            }
        },
        resolverSubtipo(tipo, subtipo) {
            if (tipo === '1') return 'Vacación';
            const map = { '0': 'Calamidad Doméstica', '1': 'Citas Médicas', '2': 'Cargo a vacaciones', '3': 'Permiso Institucional', '4': 'Asuntos Personales', '5': 'Otro' };
            return map[subtipo] || subtipo || '-';
        },
        // ---- Abrir popups ----
        getNuevoEditar_Permiso(item) {
            this.tab_Permiso = item ? { ...item } : {};
            this.popupGuardarEditar_Permiso = true;
        },
        getEliminar_Permiso(item) {
            this.tab_Permiso = { ...item };
            this.popupActivoEliminar_Permiso = true;
        },
        getActivarDesactivar_Permiso(item) {
            this.tab_Permiso = { ...item };
            this.popupActivoDesactivar_Permiso = true;
        },
        getInformacion_Permiso() {
            this.popupInformacion_Permiso = true;
        },
        getImprimir_Permiso(item) {
            this.tab_Permiso = { ...item };
            this.popupImprimir_Permiso = true;
        },
        // ---- Handlers emit ----
        changeHandleNuevoEditar_Permiso(e) {
            if (e.verificacionemitsaveandedit === 1) {
                this.popupGuardarEditar_Permiso = false;
                this.getConteo_Permisos();
            } else if (e.verificacionemitsaveandedit === 2) {
                this.popupGuardarEditar_Permiso = false;
            }
        },
        changeHandleEliminar_Permiso(e) {
            if (e.verificacionemiteliminar === 1) {
                this.popupActivoEliminar_Permiso = false;
                this.getConteo_Permisos();
            } else {
                this.popupActivoEliminar_Permiso = false;
            }
        },
        changeHandleActivar_Desactivar_Permiso(e) {
            if (e.verificacionemitdesactivar === 1) {
                this.popupActivoDesactivar_Permiso = false;
                this.getConteo_Permisos();
            } else {
                this.popupActivoDesactivar_Permiso = false;
            }
        },
        changeHandleInformacion_Permiso(e) {
            if (e.verificacionemitinformacion === 2) {
                this.popupInformacion_Permiso = false;
            }
        },
        changeHandleImprimir_Permiso(e) {
            if (e.verificacionemitimprimir === 1) {
                this.getConteo_Permisos();
            } else if (e.verificacionemitimprimir === 2) {
                this.popupImprimir_Permiso = false;
            }
        },
        reactivarEdicion(tr) {
            let me = this;
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `Confirmar Reactivación`,
                text: '¿Está seguro de reactivar esta solicitud? Volverá a estar "Activa" y editable.',
                acceptText: 'Sí, Reactivar',
                cancelText: 'Cancelar',
                accept: () => {
                    me.$vs.loading();
                    let formData = new FormData();
                    formData.append('action', 'Desactivar_Permiso');
                    formData.append('tpe_id', tr.tpe_id);
                    formData.append('tpe_estado', '1');
                    me.$http.post(me.$server_url + 'VerifcarMetodosPost_Permisos', formData)
                    .then(res => {
                        me.$vs.loading.close();
                        if (res.data.status === 1) {
                            me.$vs.notify({ text: res.data.message, color: 'success', iconPack: 'feather', icon: 'icon-check' });
                            me.getConteo_Permisos();
                        } else {
                            me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        me.$vs.loading.close();
                        me.$vs.notify({ text: 'Error al reactivar', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                    });
                }
            })
        },
    },
};
</script>

<style scoped>
.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

.dept-tag {
    background: #f1f5f9;
    color: #64748b;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    display: inline-block;
    margin-top: 3px;
    border: 1px solid #e2e8f0;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

/* ── Estilos Panel Informativo ───────────────────────── */
.info-entrega-container {
    margin: 20px 0;
}

.info-card-premium {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    padding: 20px;
}

.info-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.info-icon-box {
    width: 44px;
    height: 44px;
    background: #fdf2f8;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.info-title {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    color: #1e293b;
}

.info-subtitle {
    margin: 2px 0 0;
    font-size: 12.5px;
    color: #64748b;
}

.info-steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
}

.step-item {
    background: #fff;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid #f1f5f9;
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.step-item.highlight {
    background: #fff1f2;
    border-color: #fecdd3;
}

.step-number {
    width: 28px;
    height: 28px;
    background: #e2e8f0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
    color: #475569;
    flex-shrink: 0;
}

.step-number.highlight-num {
    background: #f43f5e;
    color: #fff;
}

.step-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.step-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    letter-spacing: 0.05em;
}

.highlight .step-label {
    color: #e11d48;
}

.step-desc {
    margin: 0;
    font-size: 12.5px;
    color: #334155;
    line-height: 1.4;
}
</style>
