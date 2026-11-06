<template>
<vx-card fixed-height="true">
    <div>
        <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditar_Memo(); verificarcrear_actualizar = 'create'">
            Registrar Nuevo Memorando
        </vs-button>
        <!-- <vs-button color="dark" type="border" icon="info" @click="getInformacion_Memo()" style="float:right" title="Información">
            Información
        </vs-button> -->
    </div>

    <!-- PANEL INFORMATIVO DE MEMORANDO -->
    <div class="info-memo-container">
        <div class="info-card-premium">
            <div class="info-header-memo">
                <div class="info-icon-box">
                    <span class="info-emoji">📝</span>
                </div>
                <div class="info-text">
                    <h3 class="info-title">Uso de Memorandos</h3>
                    <p class="info-subtitle">Flexibilidad y personalización del documento.</p>
                </div>
            </div>
            <div class="info-steps-grid">
                <div class="step-item">
                    <div class="step-icon-box">📄</div>
                    <div class="step-content">
                        <span class="step-label">Modelo Base</span>
                        <p class="step-desc">El sistema carga un formato predefinido para solicitud de horas suplementarias y extraordinarias.</p>
                    </div>
                </div>
                <div class="step-item highlight">
                    <div class="step-icon-box highlight-icon">✨</div>
                    <div class="step-content">
                        <span class="step-label">Personalización Total</span>
                        <p class="step-desc">Usted puede <b>borrar o modificar</b> el contenido para cualquier otro requerimiento administrativo.</p>
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
            @input="getConteo_Memos()"
        />
        <vs-button v-if="filtroDepartamento" color="warning" type="flat" size="small" @click="filtroDepartamento = null; getConteo_Memos()">Limpiar filtro</vs-button>
    </div>

    <vs-row>
        <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
            <vs-table ref="table" pagination :max-items="registrosmaximos" :data="Array_Memos" noDataText="No hay registros de Memorando" search>
                <template slot="header">
                    <vs-chip v-if="Array_Memos" color="primary">Cantidad: <b> {{ Array_Memos.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th sort-key="tme_id">{{ isRouteTalentoHumano ? '#' : 'Código' }}</vs-th>
                    <!-- <vs-th sort-key="tme_numero_memo">N° Memo</vs-th> -->
                    <vs-th>Departamento</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Seguimiento</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td v-if="!isRouteTalentoHumano" :data="tr.tme_id">{{ tr.tme_id }}</vs-td>
                        <vs-td v-else><b>{{ Array_Memos.length - Array_Memos.indexOf(tr) }}</b></vs-td>
                        <!-- <vs-td>
                            <span class="numero-memo-chip">{{ tr.tme_numero_memo }}</span>
                        </vs-td> -->
                        <vs-td>{{ tr.tme_jefe_departamento_display }}</vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.tme_estado == '1'" color="success">Activo</vs-chip>
                            <vs-chip v-else-if="tr.tme_estado == '0'" color="danger">Anulado</vs-chip>
                            <vs-chip v-else-if="tr.tme_estado == '2'" color="warning">Impreso</vs-chip>
                        </vs-td>
                        <vs-td>
                            <small><b>Creación:</b><br>{{ tr.created_at }} ({{ tr.name_created_by }})</small>
                            <br>
                            <small><b>Modificación:</b><br>{{ tr.updated_at }} ({{ tr.name_updated_by }})</small>
                        </vs-td>
                        <vs-td :data="data[indextr].tme_id">
                            <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                <vs-dropdown-menu style="width:250px;" class="cursor">
                                    <vs-dropdown-item>
                                        <vs-button v-if="tr.tme_estado == '1'" color="#28C76F" type="line" class="w-full" @click="getNuevoEditar_Memo(tr); verificarcrear_actualizar = 'update'">
                                            Editar
                                        </vs-button>
                                        <vs-button v-if="userRoot" color="#EA5455" type="line" class="w-full" @click="getEliminar_Memo(tr)">
                                            Eliminar
                                        </vs-button>
                                        <vs-button v-if="tr.tme_estado == '1' || tr.tme_estado == '2'" color="#EA5455" type="line" class="w-full" @click="getActivarDesactivar_Memo(tr)">
                                            Anular Memorando
                                        </vs-button>
                                        <vs-button v-if="tr.tme_estado == '0' && userRoot" color="#28C76F" type="line" class="w-full" @click="getActivarDesactivar_Memo(tr)">
                                            Reactivar Memorando
                                        </vs-button>
                                        <vs-button v-if="tr.tme_estado == '2' && userRoot" color="#FF9F43" type="line" class="w-full" @click="reactivarEdicion(tr)">Reactivar Edición</vs-button>
                                        <vs-button color="#7367F0" type="line" icon-pack="feather" icon="icon-printer" class="w-full" @click="getImprimir_Memo(tr)">
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
    <vs-popup class="informacionformhijo" @close="getConteo_Memos();" :title="verificarcrear_actualizar === 'create' ? 'Registrar Nuevo Memorando' : `Actualizar Memorando #${tab_Memo.tme_numero_memo || ''}`" :active.sync="popupGuardarEditar_Memo" fullscreen>
        <Nuevo_Edit_Memo v-if="popupGuardarEditar_Memo" :verificarcrear_actualizar="verificarcrear_actualizar" :tab_Memo="tab_Memo" @change="changeHandleNuevoEditar_Memo" />
    </vs-popup>

    <!-- POPUP ELIMINAR -->
    <vs-popup title="Eliminar Memorando" :active.sync="popupActivoEliminar_Memo">
        <Eliminar_Memo v-if="popupActivoEliminar_Memo" :tab_Memo="tab_Memo" @change="changeHandleEliminar_Memo" />
    </vs-popup>

    <!-- POPUP ACTIVAR/DESACTIVAR -->
    <vs-popup :title="(tab_Memo && (tab_Memo.tme_estado == '1' || tab_Memo.tme_estado == '2')) ? '¿Anular el memorando?' : '¿Reactivar el memorando?'" :active.sync="popupActivoDesactivar_Memo">
        <ActivarDesactivar_Memo v-if="popupActivoDesactivar_Memo" :tab_Memo="tab_Memo" @change="changeHandleActivar_Desactivar_Memo" />
    </vs-popup>

    <!-- POPUP INFORMACIÓN -->
    <vs-popup class="informacionformhijo" title="Información" :active.sync="popupInformacion_Memo">
        <Informacion_Memo v-if="popupInformacion_Memo" :userRoot="userRoot" @change="changeHandleInformacion_Memo" />
    </vs-popup>

    <!-- POPUP IMPRIMIR -->
    <vs-popup title="Imprimir Memorando" class="informacionformhijo" :active.sync="popupImprimir_Memo" fullscreen>
        <Reporte_Memo v-if="popupImprimir_Memo" :tab_Memo="tab_Memo" @change="changeHandleImprimir_Memo" />
    </vs-popup>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select';

const Nuevo_Edit_Memo = () => import("@/views/talento_humano/reportes/Memorando/registro_edicion_memorando.vue");
const Eliminar_Memo = () => import("@/views/talento_humano/reportes/Memorando/eliminar_memorando.vue");
const ActivarDesactivar_Memo = () => import("@/views/talento_humano/reportes/Memorando/activar_desactivar_memorando.vue");
const Informacion_Memo = () => import("@/views/talento_humano/reportes/Memorando/informacion_memorando.vue");
const Reporte_Memo = () => import("@/views/talento_humano/reportes/Memorando/reporte_memorando.vue");

export default {
    components: {
        'v-select': vSelect,
        Nuevo_Edit_Memo,
        Eliminar_Memo,
        ActivarDesactivar_Memo,
        Informacion_Memo,
        Reporte_Memo,
    },
    data() {
        return {
            Array_Memos: [],
            tab_Memo: {},
            isRouteTalentoHumano: false,
            verificarcrear_actualizar: 'create',
            popupGuardarEditar_Memo: false,
            popupActivoEliminar_Memo: false,
            popupActivoDesactivar_Memo: false,
            popupInformacion_Memo: false,
            popupImprimir_Memo: false,
            registrosmaximos: 50,
            departamentos: [],
            filtroDepartamento: null,
        };
    },
    mounted() {
        this.getConteo_Memos();
        this.getDepartamentosActivos();
        let currentPath = this.$route.path;
        this.isRouteTalentoHumano = currentPath.includes('/talento-humano/reportes');
    },
    watch: {
        userRoot() {
            this.getConteo_Memos();
        }
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
            } catch (e) {
                return {};
            }
        },
    },
    methods: {
        getConteo_Memos() {
            let me = this;
            me.$vs.loading();

            const action = me.userRoot ? 'Get_Memos' : 'Get_Memos_xCreado';
            const params = {
                action
            };
            if (!me.userRoot) params.idusuario = me.usuarioActual.idusuario;
            if (me.userRoot && me.filtroDepartamento) params.idusuario = me.filtroDepartamento;

            me.$http.get(me.$server_url + 'VerifcarMetodosGet_Memo', {
                    params
                })
                .then(res => {
                    me.Array_Memos = res.data || [];
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },
        getDepartamentosActivos() {
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Memo?action=Get_JefesDepartamento')
                .then(res => {
                    this.departamentos = res.data;
                })
                .catch(err => console.log(err));
        },
        getNuevoEditar_Memo(item) {
            this.tab_Memo = item ? {
                ...item
            } : {};
            this.popupGuardarEditar_Memo = true;
        },
        getEliminar_Memo(item) {
            this.tab_Memo = {
                ...item
            };
            this.popupActivoEliminar_Memo = true;
        },
        getActivarDesactivar_Memo(item) {
            this.tab_Memo = {
                ...item
            };
            this.popupActivoDesactivar_Memo = true;
        },
        getInformacion_Memo() {
            this.popupInformacion_Memo = true;
        },
        getImprimir_Memo(item) {
            this.tab_Memo = {
                ...item
            };
            this.popupImprimir_Memo = true;
        },
        reactivarEdicion(tr) {
            let me = this;
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `Confirmar Reactivación`,
                text: '¿Está seguro de reactivar esta memorando? Volverá a estar "Activo" y editable.',
                acceptText: 'Sí, Reactivar',
                cancelText: 'Cancelar',
                accept: () => {
                    me.$vs.loading();
                    const params = {
                        action: 'Desactivar_Memo',
                        tme_id: tr.tme_id,
                        tme_estado: '1'
                    };
                    me.$http.post(me.$server_url + 'VerifcarMetodosPost_Memo', params)
                        .then(res => {
                            me.$vs.loading.close();
                            if (res.data.status === 1) {
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                                me.getConteo_Memos();
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
                                text: 'Error al reactivar',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        });
                }
            })
        },
        changeHandleNuevoEditar_Memo(e) {
            if (e.verificacionemitsaveandedit === 1) {
                this.popupGuardarEditar_Memo = false;
                this.getConteo_Memos();
            } else {
                this.popupGuardarEditar_Memo = false;
            }
        },
        changeHandleEliminar_Memo(e) {
            if (e.verificacionemiteliminar === 1) {
                this.popupActivoEliminar_Memo = false;
                this.getConteo_Memos();
            } else {
                this.popupActivoEliminar_Memo = false;
            }
        },
        changeHandleActivar_Desactivar_Memo(e) {
            if (e.verificacionemitdesactivar === 1) {
                this.popupActivoDesactivar_Memo = false;
                this.getConteo_Memos();
            } else {
                this.popupActivoDesactivar_Memo = false;
            }
        },
        changeHandleInformacion_Memo(e) {
            if (e.verificacionemitinformacion === 2) this.popupInformacion_Memo = false;
        },
        changeHandleImprimir_Memo(e) {
            if (e.verificacionemitimprimir === 1) {
                this.getConteo_Memos();
            } else if (e.verificacionemitimprimir === 2) {
                this.popupImprimir_Memo = false;
            }
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

.numero-memo-chip {
    background: #eff6ff;
    color: #1d4ed8;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    border: 1px solid #bfdbfe;
    white-space: nowrap;
}

/* ── Estilos Panel Informativo ───────────────────────── */
.info-memo-container {
    margin: 20px 0;
}

.info-card-premium {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    padding: 20px;
}

.info-header-memo {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.info-icon-box {
    width: 44px;
    height: 44px;
    background: #eff6ff;
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
    background: #f0f9ff;
    border-color: #bae6fd;
}

.step-icon-box {
    width: 32px;
    height: 32px;
    background: #f1f5f9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
}

.highlight-icon {
    background: #e0f2fe;
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

.step-item.highlight .step-label {
    color: #0369a1;
}

.step-desc {
    margin: 0;
    font-size: 12.5px;
    color: #334155;
    line-height: 1.4;
}
</style>
