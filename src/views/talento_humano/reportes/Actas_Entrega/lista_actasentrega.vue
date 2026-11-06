<template>
<vx-card fixed-height="true">
    <div>
        <vs-button type="border" color="success" class="mr-2"
            @click="getNuevoEditar_ActaEntrega(); verificarcrear_actualizar = 'create'">
            Nueva Acta de Entrega
        </vs-button>
        <vs-button color="dark" type="border" icon="info" @click="getInformacion_ActaEntrega()"
            style="float:right" title="Información">
            Información
        </vs-button>
    </div>

    <vs-row>
        <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
            <vs-table ref="table" pagination :max-items="registrosmaximos" :data="Array_ActasEntrega"
                noDataText="Sin datos" search>
                <template slot="header">
                    <vs-col vs-w="12">
                        <h4>Actas de Entrega – Recepción</h4>
                    </vs-col>
                </template>
                <template slot="thead">
                    <vs-th sort-key="tae_id">#</vs-th>
                    <vs-th sort-key="tae_numero_acta">N° Acta</vs-th>
                    <vs-th sort-key="tae_fecha">Fecha</vs-th>
                    <vs-th>Entregado por</vs-th>
                    <vs-th>Recibido por</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Seguimiento</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="tr.tae_id">{{ tr.tae_id }}</vs-td>
                        <vs-td>
                            <span class="numero-acta-chip">{{ tr.tae_numero_acta }}</span>
                        </vs-td>
                        <vs-td>{{ tr.tae_fecha }}</vs-td>
                        <vs-td>
                            <span>{{ tr.tae_entregado_por_display }}</span>
                            <br v-if="tr.tae_entregado_cargo">
                            <small v-if="tr.tae_entregado_cargo" class="cargo-tag">{{ tr.tae_entregado_cargo }}</small>
                        </vs-td>
                        <vs-td>
                            <span>{{ tr.tae_recibido_por_display }}</span>
                            <br v-if="tr.tae_recibido_cargo">
                            <small v-if="tr.tae_recibido_cargo" class="cargo-tag">{{ tr.tae_recibido_cargo }}</small>
                        </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.tae_estado == '1'" color="success">Activo</vs-chip>
                            <vs-chip v-else-if="tr.tae_estado == '0'" color="danger">Anulado</vs-chip>
                            <vs-chip v-else-if="tr.tae_estado == '2'" color="warning">Impreso</vs-chip>
                        </vs-td>
                        <vs-td>
                            <small><b>Creación:</b><br>{{ tr.created_at }} ({{ tr.name_created_by }})</small>
                            <br>
                            <small><b>Modificación:</b><br>{{ tr.updated_at }} ({{ tr.name_updated_by }})</small>
                        </vs-td>
                        <vs-td :data="data[indextr].tae_id">
                            <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                <vs-dropdown-menu style="width:250px;" class="cursor">
                                    <vs-dropdown-item>
                                        <vs-button v-if="tr.tae_estado == '1'" color="#28C76F" type="line" class="w-full"
                                            @click="getNuevoEditar_ActaEntrega(tr); verificarcrear_actualizar = 'update'">
                                            Editar
                                        </vs-button>
                                        <vs-button v-if="userRoot" color="#EA5455" type="line" class="w-full"
                                            @click="getEliminar_ActaEntrega(tr)">
                                            Eliminar
                                        </vs-button>
                                        <vs-button v-if="tr.tae_estado == '1' || tr.tae_estado == '2'" color="#EA5455" type="line" class="w-full"
                                            @click="getActivarDesactivar_ActaEntrega(tr)">
                                            Anular Acta
                                        </vs-button>
                                        <vs-button v-if="tr.tae_estado == '0' && userRoot" color="#28C76F" type="line" class="w-full"
                                            @click="getActivarDesactivar_ActaEntrega(tr)">
                                            Reactivar Acta
                                        </vs-button>
                                        <vs-button v-if="tr.tae_estado == '2' && userRoot" color="#FF9F43" type="line" class="w-full" @click="reactivarEdicion(tr)">Reactivar Edición</vs-button>
                                        <vs-button color="#7367F0" type="line" icon-pack="feather" icon="icon-printer" class="w-full"
                                            @click="getImprimir_ActaEntrega(tr)">
                                            Ver / Imprimir
                                        </vs-button>
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
    <vs-popup class="informacionformhijo" @close="getConteo_ActasEntrega();"
        :title="verificarcrear_actualizar === 'create' ? 'Nueva Acta de Entrega – Recepción' : `Editar Acta #${tab_ActaEntrega.tae_numero_acta || ''}`"
        :active.sync="popupGuardarEditar_ActaEntrega" fullscreen>
        <Nuevo_Edit_ActaEntrega
            v-if="popupGuardarEditar_ActaEntrega"
            :verificarcrear_actualizar="verificarcrear_actualizar"
            :tab_ActaEntrega="tab_ActaEntrega"
            @change="changeHandleNuevoEditar_ActaEntrega" />
    </vs-popup>

    <!-- POPUP ELIMINAR -->
    <vs-popup title="Eliminar Acta" :active.sync="popupActivoEliminar_ActaEntrega">
        <Eliminar_ActaEntrega
            v-if="popupActivoEliminar_ActaEntrega"
            :tab_ActaEntrega="tab_ActaEntrega"
            @change="changeHandleEliminar_ActaEntrega" />
    </vs-popup>

    <!-- POPUP ACTIVAR/DESACTIVAR -->
    <vs-popup :title="(tab_ActaEntrega && (tab_ActaEntrega.tae_estado == '1' || tab_ActaEntrega.tae_estado == '2')) ? '¿Anular el acta?' : '¿Reactivar el acta?'"
        :active.sync="popupActivoDesactivar_ActaEntrega">
        <ActivarDesactivar_ActaEntrega
            v-if="popupActivoDesactivar_ActaEntrega"
            :tab_ActaEntrega="tab_ActaEntrega"
            @change="changeHandleActivar_Desactivar_ActaEntrega" />
    </vs-popup>

    <!-- POPUP INFORMACIÓN -->
    <vs-popup class="informacionformhijo" title="Información" :active.sync="popupInformacion_ActaEntrega">
        <Informacion_ActaEntrega
            v-if="popupInformacion_ActaEntrega"
            :userRoot="userRoot"
            @change="changeHandleInformacion_ActaEntrega" />
    </vs-popup>

    <!-- POPUP IMPRIMIR -->
    <vs-popup title="Imprimir Acta de Entrega" class="informacionformhijo" :active.sync="popupImprimir_ActaEntrega" fullscreen>
        <Reporte_ActaEntrega
            v-if="popupImprimir_ActaEntrega"
            :tab_ActaEntrega="tab_ActaEntrega"
            @change="changeHandleImprimir_ActaEntrega" />
    </vs-popup>
</vx-card>
</template>

<script>
import { mapState } from "vuex";

const Nuevo_Edit_ActaEntrega        = () => import("@/views/talento_humano/reportes/Actas_Entrega/registro_edicion_actasentrega.vue");
const Eliminar_ActaEntrega          = () => import("@/views/talento_humano/reportes/Actas_Entrega/eliminar_actasentrega.vue");
const ActivarDesactivar_ActaEntrega = () => import("@/views/talento_humano/reportes/Actas_Entrega/activar_desactivar_actasentrega.vue");
const Informacion_ActaEntrega       = () => import("@/views/talento_humano/reportes/Actas_Entrega/informacion_actasentrega.vue");
const Reporte_ActaEntrega           = () => import("@/views/talento_humano/reportes/Actas_Entrega/reporte_actasentrega.vue");

export default {
    components: {
        Nuevo_Edit_ActaEntrega,
        Eliminar_ActaEntrega,
        ActivarDesactivar_ActaEntrega,
        Informacion_ActaEntrega,
        Reporte_ActaEntrega,
    },
    data() {
        return {
            Array_ActasEntrega: [],
            tab_ActaEntrega: {},
            verificarcrear_actualizar: 'create',
            popupGuardarEditar_ActaEntrega: false,
            popupActivoEliminar_ActaEntrega: false,
            popupActivoDesactivar_ActaEntrega: false,
            popupInformacion_ActaEntrega: false,
            popupImprimir_ActaEntrega: false,
            registrosmaximos: 50,
        };
    },
    mounted() {
        this.getConteo_ActasEntrega();
    },
    watch: {
        userRoot() { this.getConteo_ActasEntrega(); }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario']),
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
        getConteo_ActasEntrega() {
            let me = this;
            me.$vs.loading();

            const action = me.userRoot ? 'Get_ActasEntrega' : 'Get_ActasEntrega_xCreador';
            const params = { action };
            if (!me.userRoot) params.idusuario = me.usuarioActual.idusuario;

            me.$http.get(me.$server_url + 'VerifcarMetodosGet_ActaEntrega', { params })
                .then(res => { me.Array_ActasEntrega = res.data || []; me.$vs.loading.close(); })
                .catch(err => { console.log(err); me.$vs.loading.close(); });
        },
        getNuevoEditar_ActaEntrega(item) {
            this.tab_ActaEntrega = item ? { ...item } : {};
            this.popupGuardarEditar_ActaEntrega = true;
        },
        getEliminar_ActaEntrega(item) {
            this.tab_ActaEntrega = { ...item };
            this.popupActivoEliminar_ActaEntrega = true;
        },
        getActivarDesactivar_ActaEntrega(item) {
            this.tab_ActaEntrega = { ...item };
            this.popupActivoDesactivar_ActaEntrega = true;
        },
        getInformacion_ActaEntrega() {
            this.popupInformacion_ActaEntrega = true;
        },
        getImprimir_ActaEntrega(item) {
            this.tab_ActaEntrega = { ...item };
            this.popupImprimir_ActaEntrega = true;
        },
        changeHandleNuevoEditar_ActaEntrega(e) {
            if (e.verificacionemitsaveandedit === 1) {
                this.popupGuardarEditar_ActaEntrega = false;
                this.getConteo_ActasEntrega();
            } else {
                this.popupGuardarEditar_ActaEntrega = false;
            }
        },
        changeHandleEliminar_ActaEntrega(e) {
            if (e.verificacionemiteliminar === 1) {
                this.popupActivoEliminar_ActaEntrega = false;
                this.getConteo_ActasEntrega();
            } else {
                this.popupActivoEliminar_ActaEntrega = false;
            }
        },
        changeHandleActivar_Desactivar_ActaEntrega(e) {
            if (e.verificacionemitdesactivar === 1) {
                this.popupActivoDesactivar_ActaEntrega = false;
                this.getConteo_ActasEntrega();
            } else {
                this.popupActivoDesactivar_ActaEntrega = false;
            }
        },
        changeHandleInformacion_ActaEntrega(e) {
            if (e.verificacionemitinformacion === 2) this.popupInformacion_ActaEntrega = false;
        },
        changeHandleImprimir_ActaEntrega(e) {
            if (e.verificacionemitimprimir === 1) {
                this.getConteo_ActasEntrega();
            } else if (e.verificacionemitimprimir === 2) {
                this.popupImprimir_ActaEntrega = false;
            }
        },
        reactivarEdicion(tr) {
            let me = this;
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `Confirmar Reactivación`,
                text: '¿Está seguro de reactivar esta acta? Volverá a estar "Activa" y editable.',
                acceptText: 'Sí, Reactivar',
                cancelText: 'Cancelar',
                accept: () => {
                    me.$vs.loading();
                    let formData = new FormData();
                    formData.append('action', 'Desactivar_ActaEntrega');
                    formData.append('tae_id', tr.tae_id);
                    formData.append('tae_estado', '1');
                    me.$http.post(me.$server_url + 'VerifcarMetodosPost_ActaEntrega', formData)
                    .then(res => {
                        me.$vs.loading.close();
                        if (res.data.status === 1) {
                            me.$vs.notify({ text: res.data.message, color: 'success', iconPack: 'feather', icon: 'icon-check' });
                            me.getConteo_ActasEntrega();
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
.numero-acta-chip {
    background: #eff6ff;
    color: #1d4ed8;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    border: 1px solid #bfdbfe;
    white-space: nowrap;
}
.cargo-tag {
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
</style>
