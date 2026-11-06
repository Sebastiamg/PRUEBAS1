<template>
<vx-card fixed-height="true">
    <div>
        <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditar_Reporte(); verificarcrear_actualizar = 'create'">Registrar Nuevo Reporte</vs-button>
        <!-- <vs-button color="dark" type="border" icon="info" @click="getInformacion_Reporte()" style="float: right" title="Información">Información</vs-button> -->
    </div>

    <!-- PANEL INFORMATIVO DE PRESENTACIÓN -->
    <div class="calendario-container">
        <div class="calendar-card-premium">
            <div class="calendar-header-info">
                <div class="calendar-icon-box">
                    <span class="calendar-emoji">📅</span>
                </div>
                <div class="calendar-text">
                    <h3 class="calendar-title">Calendario de Presentación</h3>
                    <p class="calendar-subtitle">Siga estos pasos para la entrega correcta de su reporte mensual.</p>
                </div>
            </div>
            <div class="info-steps-grid">
                <div class="step-item">
                    <div class="step-icon-box">📅</div>
                    <div class="step-content">
                        <span class="step-label">Corte Mensual</span>
                        <p class="step-desc">El corte se realiza el día <b>22</b> de cada mes.</p>
                    </div>
                </div>
                <div class="step-item highlight">
                    <div class="step-icon-box highlight-icon">🏢</div>
                    <div class="step-content">
                        <span class="step-label">Presentación a TALENTO HUMANO</span>
                        <p class="step-desc">El reporte debe ser <b>impreso y entregado</b> el día <b>23*</b>.</p>
                    </div>
                </div>
            </div>
            <div class="calendar-footer-note" style="margin-top: 15px;">
                <span class="note-icon">ℹ️</span>
                <p>* Si el día 23 cae fin de semana o feriado, la presentación se traslada al <b>primer día hábil</b>.</p>
            </div>
        </div>
    </div>
    <!-- Filtro de departamento: solo visible para userRoot -->
    <div v-if="userRoot" style="margin: 10px 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <label style="font-weight:600; font-size:13px;">Filtrar por Jefe de Área (Creador):</label>
        <v-select
            v-model="filtroJefe"
            :options="listaJefes"
            :reduce="d => d.value"
            label="label"
            placeholder="-- Todos los jefes --"
            style="min-width:230px; font-size:13px;"
            @input="getConteo_Reportes()"
        />
        <vs-button v-if="filtroJefe" color="warning" type="flat" size="small" @click="filtroJefe = null; getConteo_Reportes()">Limpiar filtro</vs-button>
    </div>
    <vs-row>
        <vs-col type="flex" v-if="conteoregistros>registrosmaximos" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
            <p>Búsqueda por filtros</p>
            <br />
            <vs-card class="seccionmostrartodo">
                <div>
                    <br>
                    <div class="vx-row mb-1">
                        <div style="display: inline-block; margin: 0px 3px 0px 3px;">
                            <!-- currency -->
                            <vx-input-group class="mb-base" style="display:flex;flex-wrap: wrap;">
                                <template slot="prepend">
                                    <div class="prepend-text bg-primary" style="height: 38px;">
                                        <span>Búsqueda</span>
                                    </div>
                                </template>
                                <!-- Mostrar el input cuando se selecciona el radio button con valor 0 -->
                                <vs-input v-if="tipo == 0" class="w-full" @keyup.enter="getParametro_Editoriales()" icon-after="true" label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar" v-model="parametrobusqueda" />
                                <v-select v-else-if="tipo == 1" :options="UsuariosLibrerias" :reduce="UsuariosLibrerias => UsuariosLibrerias.idusuario" label="datosbusqueda" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getParametro_Editoriales()" />
                                <v-select v-else-if="tipo == 2" :options="ContratoAgrupacion" :reduce="ContratoAgrupacion => ContratoAgrupacion.ca_id" label="datoscontagrupados" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getParametro_Editoriales()" />
                            </vx-input-group>
                            <!-- /currency -->
                        </div>
                        <div style="display: inline-flex; margin: 0px 3px 0px 3px">
                            <ul class="flex mt-2">
                                <li>
                                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="0" @input="busqueda = 'codigoagrupado'; limpiar()">Código</vs-radio>
                                </li>
                                <li>
                                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="1" @input="busqueda = 'nombreusuario'; limpiar()">Usuario</vs-radio>
                                </li>
                                <li>
                                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="2" @input="busqueda = 'infocontratoagrupado'; limpiar()">Contrato Agrupado</vs-radio>
                                </li>
                            </ul>
                        </div>
                        <div style="display: inline-flex; margin: 0px 3px 0px 3px">
                            <vs-button v-if="tipo == 0" color="primary" style="height: 38px;" @click="getParametro_Editoriales()" type="filled">Buscar</vs-button>
                        </div>
                    </div>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditar_Editoriales()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" pagination search :data="Array_Reportes" no-data-text="No hay registros de Reportes Semanales">
        <template slot="header">
            <vs-chip v-if="Array_Reportes" color="primary">Cantidad: <b> {{ Array_Reportes.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th width="100">
                {{ isRouteTalentoHumano ? '#' : 'Código' }}
            </vs-th>
            <vs-th colspan="1" width="300">
                Solicitado Por
            </vs-th>
            <vs-th colspan="1" width="200">
                Autorizado Por
            </vs-th>
            <vs-th colspan="1" width="320">
                Seguimiento
            </vs-th>
            <vs-th width="100">
                Estado
            </vs-th>
            <vs-th width="100">
                Acciones
            </vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td v-if="!isRouteTalentoHumano">
                    {{ tr.tre_id }}
                </vs-td>
                <vs-td v-else>
                    <b>{{ Array_Reportes.length - Array_Reportes.indexOf(tr) }}</b>
                </vs-td>
                <vs-td>
                    <span class="multi-line">{{tr.tre_solicitado_por_display || tr.tre_solicitado_por}}</span>
                    <small class="dept-tag">{{tr.tre_solicitado_departamento_display}}</small>
                </vs-td>
                <vs-td>
                    <span>{{tr.tre_autorizado_por_display}}</span><br>
                    <small class="dept-tag">{{tr.tre_autorizado_departamento_display}}</small>
                </vs-td>
                <vs-td>
                    <small><b>Creación:</b><br> {{tr.created_at}} ({{ tr.name_created_by }})</small>
                    <br>
                    <small><b>Modificación:</b><br> {{tr.updated_at}} ({{ tr.name_updated_by }})</small>
                </vs-td>
                <vs-td>
                    <vs-chip v-if="tr.tre_estado == '1'" color="success">Activo</vs-chip>
                    <vs-chip v-else-if="tr.tre_estado == '0'" color="danger">Anulado</vs-chip>
                    <vs-chip v-else-if="tr.tre_estado == '2'" color="warning">Impreso</vs-chip>
                </vs-td>
                <vs-td :data="data[indextr].tre_id">
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 250px;" class="cursor">
                          <vs-dropdown-item>
                                <vs-button v-if="tr.tre_estado == '1'" color="#28C76F" type="line" class="w-full" @click="getNuevoEditar_Reporte(tr); verificarcrear_actualizar='update'; tab_Reporte=tr">Editar</vs-button>
                                <vs-button v-if="userRoot" color="#EA5455" type="line" class="w-full" @click="getPreguntaEliminar(tr);tab_Reporte=tr">Eliminar</vs-button>
                                <vs-button v-if="tr.tre_estado == '1' || tr.tre_estado == '2'" color="#EA5455" type="line" class="w-full" @click="popup_desactivar_activar_Reporte(tr)">
                                    Anular Reporte
                                </vs-button>
                                <vs-button v-if="tr.tre_estado == '0' && userRoot" color="#28C76F" type="line" class="w-full" @click="popup_desactivar_activar_Reporte(tr)">
                                    Reactivar Reporte
                                </vs-button>
                                <vs-button v-if="tr.tre_estado == '2' && userRoot" color="#FF9F43" type="line" class="w-full" @click="reactivarEdicion(tr)">Reactivar Edición</vs-button>
                                <vs-button color="#7367F0" type="line" icon-pack="feather" icon="icon-printer" class="w-full" @click="popupImprimirReporte(tr)">Ver / Imprimir</vs-button>
                          </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="informacionformhijo" @close="getConteo_Reportes();" :title="verificarcrear_actualizar === 'create' ? 'Registrar Nuevo Reporte Semanal' : `Actualizar reporte: #${tab_Reporte.tre_id || ''}`" :active.sync="popupGuardarEditar_Reporte" fullscreen>
        <Nuevo_Edit_ReporteSemanal v-if="popupGuardarEditar_Reporte" :verificarcrear_actualizar="verificarcrear_actualizar" :tab_Reporte="tab_Reporte" @change="changeHandleNuevoEditar_Reporte" />
    </vs-popup>
    <!-- SECCION ELIMINAR -->
    <vs-popup class="eliminar" @close="getConteo_Reportes();" :title="`¿Confirma que desea eliminar el reporte?`" :active.sync="popupActivoEliminar_Reporte">
        <Eliminar_ReporteSemanal v-if="popupActivoEliminar_Reporte" :tab_Reporte="tab_Reporte" @change="changeHandleEliminar_Reporte" />
    </vs-popup>
    <!-- SECCION ACTIVAR/DESACTIVAR -->
    <vs-popup class="desactivar" @close="getConteo_Reportes();" :title="(tab_Reporte.tre_estado === '1' || tab_Reporte.tre_estado === '2')
            ? `¿Anular el reporte?`
            : tab_Reporte.tre_estado === '0'
            ? `¿Reactivar el reporte?`
            : `Estado no controlado`" :active.sync="popupActivoDesactivar_Reporte">
        <ActivarDesactivar_ReporteSemanal v-if="popupActivoDesactivar_Reporte" :tab_Reporte="tab_Reporte" @change="changeHandleActivar_Desactivar_Reporte" />
    </vs-popup>
    <!-- SECCION INFORMACIÓN -->
    <vs-popup class="informacionformhijo" title="Información" :active.sync="popupInformacion_Reporte">
        <Informacion_ReporteSemanal v-if="popupInformacion_Reporte" :userRoot="userRoot" :popupInformacion_Reporte="popupInformacion_Reporte" @change="changeHandleInformacion_Reporte" />
    </vs-popup>
    <!-- SECCION IMPRIMIR -->
    <vs-popup title="Imprimir Reporte Semanal" class="informacionformhijo" :active.sync="popupImprimir_Reporte" fullscreen>
        <Reporte_ReporteSemanal v-if="popupImprimir_Reporte" :tab_Reporte="tab_Reporte" @change="changeHandleImprimir_Reporte" />
    </vs-popup>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select';
const Nuevo_Edit_ReporteSemanal = () => import("@/views/talento_humano/reportes/Reportes_semanales/registro_edicion_reportesemanal.vue");
const Eliminar_ReporteSemanal = () => import("@/views/talento_humano/reportes/Reportes_semanales/eliminar_reportesemanal.vue");
const ActivarDesactivar_ReporteSemanal = () => import("@/views/talento_humano/reportes/Reportes_semanales/activar_desactivar_reportesemanal.vue");
const Informacion_ReporteSemanal = () => import("@/views/talento_humano/reportes/Reportes_semanales/informacion_reportesemanal.vue");
const Reporte_ReporteSemanal = () => import("@/views/talento_humano/reportes/Reportes_semanales/reporte_reportesemanal.vue");
export default {
    data() {
        return {
            Verificacionconteo: '',
            Array_Reportes: [],
            Cont_sinfiltro_Reportes: [],
            UsuariosLibrerias: [],
            ContratoAgrupacion: [],
            popupGuardarEditar_Reporte: false,
            popupActivoEliminar_Reporte: false,
            popupActivoDesactivar_Reporte: false,
            popupInformacion_Reporte: false,
            popupImprimir_Reporte: false,
            tre_id: 0,
            parametrobusqueda: "",
            busqueda: "",
            valorBusqueda: "0",
            conteoregistros: 0,
            registrosmaximos: 90000,
            verificarcrear_actualizar: '',
            tab_Reporte: {},
            tipo: '0',
            filtroJefe: null,
            listaJefes: [],
            isRouteTalentoHumano: false,
        }
    },
    components: {
        'v-select': vSelect,
        Nuevo_Edit_ReporteSemanal,
        Eliminar_ReporteSemanal,
        ActivarDesactivar_ReporteSemanal,
        Informacion_ReporteSemanal,
        Reporte_ReporteSemanal,
    },
    mounted() {
        this.getConteo_Reportes();
        this.getJefesDepartamento();
        let currentPath = this.$route.path;
        this.isRouteTalentoHumano = currentPath.includes('/talento-humano/reportes');
    },
    watch: {
        userRoot(newVal) {
            this.getConteo_Reportes();
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
        limpiar() {
            this.parametrobusqueda = '';
            this.Array_Reportes = [];
        },
        getJefesDepartamento() {
            let me = this;
            me.$http.get(me.$server_url + 'VerifcarMetodosGet_ReportesSemanales?action=Get_JefesDepartamento')
                .then(res => {
                    me.listaJefes = res.data;
                })
                .catch(err => console.log(err));
        },
        //VERIFICA EL MAXIMO DE REGISTROS PARA MOSTRAR
        getConteo_Reportes() {
            let me = this;
            me.$vs.loading();

            if (me.userRoot) {
                // ROOT: trae todos los reportes, con filtro opcional de jefe
                let params = { action: 'Get_ReportesSemanales' };
                if (me.filtroJefe) params.idusuario = me.filtroJefe;

                me.$http.get(me.$server_url + 'VerifcarMetodosGet_ReportesSemanales', { params })
                    .then(res => {
                        me.Array_Reportes = res.data;
                        me.$vs.loading.close();
                    })
                    .catch(err => {
                        console.log(err);
                        me.$vs.loading.close();
                    });
            } else {
                // NO ROOT: solo ve los reportes donde es el autorizado
                const idusuario = me.usuarioActual.idusuario;
                me.$http.get(me.$server_url + 'VerifcarMetodosGet_ReportesSemanales', {
                    params: { action: 'Get_ReportesSemanales_xCreador', idusuario }
                })
                    .then(res => {
                        me.Array_Reportes = res.data || [];
                        me.$vs.loading.close();
                    })
                    .catch(err => {
                        console.log(err);
                        me.$vs.loading.close();
                    });
            }
        },
        getParametro_Reportes() {
            let me = this;
            if (me.tipo == 0) {
                if (me.parametrobusqueda.trim().length < 1) {
                    me.$vs.notify({
                        text: 'Minimo 2 caracteres de busqueda',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false;
                }
            }
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'Get_ReportesSemanales_xfiltro',
                busqueda: me.busqueda,
                razonbusqueda: me.parametrobusqueda
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_ReportesSemanales', {
                    params: parametrosxfiltro
                })
                .then(function (res) {
                    me.Array_Reportes = res.data;
                    if (me.Array_Reportes.length === 0) {
                        me.$vs.notify({
                            text: 'No hay reportes para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Array_Reportes = [];
                    } else {
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-user'
                            })
                        }
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                })
        },
        getNuevoEditar_Reporte(tr = null) {
            this.tab_Reporte = tr || {};
            this.popupGuardarEditar_Reporte = true;
        },
        getPreguntaEliminar(tr) {
            this.tab_Reporte = tr;
            this.popupActivoEliminar_Reporte = true;
        },
        popup_desactivar_activar_Reporte(tr) {
            this.tab_Reporte = tr;
            this.popupActivoDesactivar_Reporte = true;
        },
        getInformacion_Reporte() {
            this.popupInformacion_Reporte = true;
        },
        changeHandleNuevoEditar_Reporte(e) {
            let me = this;
            if (e.verificacionemitsaveandedit == 1) {
                me.popupGuardarEditar_Reporte = false;
                this.getConteo_Reportes();
            } else if (e.verificacionemitsaveandedit == 2) {
                me.popupGuardarEditar_Reporte = false;
            }
        },
        changeHandleEliminar_Reporte(e) {
            let me = this;
            if (e.verificacionemiteliminar == 1) {
                me.popupActivoEliminar_Reporte = false;
                this.getConteo_Reportes();
            } else if (e.verificacionemiteliminar == 2) {
                me.popupActivoEliminar_Reporte = false;
            }
        },
        changeHandleActivar_Desactivar_Reporte(e) {
            let me = this;
            if (e.verificacionemitdesactivar == 1) {
                me.popupActivoDesactivar_Reporte = false;
                this.getConteo_Reportes();
            } else if (e.verificacionemitdesactivar == 2) {
                me.popupActivoDesactivar_Reporte = false;
            }
        },
        changeHandleInformacion_Reporte(e) {
            let me = this;
            if (e.verificacionemitinformacion == 1) {
                me.popupInformacion_Reporte = false;
                this.getConteo_Reportes();
            } else if (e.verificacionemitinformacion == 2) {
                me.popupInformacion_Reporte = false;
            }
        },
        popupImprimirReporte(tr) {
            this.tab_Reporte = tr;
            this.popupImprimir_Reporte = true;
        },
        changeHandleImprimir_Reporte(e) {
            if (e.verificacionemitimprimir == 1) {
                this.popupImprimir_Reporte = false;
                this.getConteo_Reportes();
            } else if (e.verificacionemitimprimir == 2) {
                this.popupImprimir_Reporte = false;
            }
        },
        reactivarEdicion(tr) {
            let me = this;
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `Reactivar Edición`,
                text: '¿Está seguro de reactivar la edición para este reporte? Volverá al estado Activo.',
                acceptText: 'Sí, Reactivar',
                cancelText: 'Cancelar',
                accept: () => { me.ejecutarReactivarEdicion(tr); }
            })
        },
        ejecutarReactivarEdicion(tr) {
            let me = this;
            me.$vs.loading();

            let formData = new FormData();
            formData.append('action', 'Desactivar_ReportesSemanales');
            formData.append('tre_id', tr.tre_id);
            formData.append('tre_estado', '1');

            me.$http.post(me.$server_url + 'VerifcarMetodosPost_ReportesSemanales', formData)
            .then(res => {
                me.$vs.loading.close();
                if (res.data.status == 1) {
                    me.$vs.notify({ text: res.data.message, color: 'success', iconPack: 'feather', icon: 'icon-check' });
                    me.getConteo_Reportes();
                } else {
                    me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                }
            })
            .catch(err => {
                console.log(err);
                me.$vs.loading.close();
                me.$vs.notify({ text: 'Error al reactivar el reporte', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
            });
        },
    },
}
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

.multi-line {
    white-space: pre-line;
    display: block;
    line-height: 1.4;
    font-size: 13px;
}

/* ── Estilos Calendario Premium ──────────────────────── */
.calendario-container {
    margin: 20px 0;
    perspective: 1000px;
}

.calendar-card-premium {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    padding: 20px;
    transition: transform 0.3s ease;
}

.calendar-card-premium:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}

.calendar-header-info {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.calendar-icon-box {
    width: 48px;
    height: 48px;
    background: #eff6ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.calendar-title {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.02em;
}

.calendar-subtitle {
    margin: 2px 0 0;
    font-size: 13px;
    color: #64748b;
}

.calendar-body-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
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

.step-icon-box.highlight-icon {
    background: #ffe4e6;
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

.calendar-item {
    background: #fff;
    padding: 15px;
    border-radius: 12px;
    border: 1px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.calendar-item.highlight {
    background: #f0fdf4;
    border-color: #dcfce7;
}

.calendar-item.delivery {
    background: #fdf2f8;
    border-color: #fce7f3;
}

.item-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    letter-spacing: 0.05em;
}

.item-value {
    font-size: 16px;
    font-weight: 700;
    color: #334155;
}

.highlight .item-value {
    color: #16a34a;
}

.next .date-text {
    color: #2563eb;
}

.calendar-footer-note {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    background: #fffbeb;
    border-radius: 8px;
    border-left: 4px solid #f59e0b;
}

.note-icon {
    font-size: 14px;
}

.calendar-footer-note p {
    margin: 0;
    font-size: 12px;
    color: #92400e;
    line-height: 1.4;
}
</style>
