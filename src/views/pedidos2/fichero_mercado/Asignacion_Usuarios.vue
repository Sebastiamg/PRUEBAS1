<template>
<div class="wrapper-usuarios">
    <!-- ===================== TABS ===================== -->
    <vx-card>
        <vs-tabs v-model="activeTab">
            <!--  tab (vacío por ahora) -->
            <vs-tab label="Docentes de la Institución" @click="tabSeleccionado()">
                <div>
                    <!-- ✅ Si hay docentes -->
                    <div v-if="Docentes_de_Institucion.length > 0">
                        <vs-table max-items="5" search pagination :data="Docentes_de_Institucion" no-data-text="No hay datos disponibles" class="tabla-usuarios">
                            <template slot="thead">
                                <vs-th width="800">Información del Usuario</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{ data }">
                                <vs-tr v-for="(tr, indextr) in data" :key="indextr" class="fila-usuario">
                                    <vs-td class="info-usuario">
                                        <div class="info-grid">
                                            <div><b>Nombres y Apellidos:</b> {{ tr.nombres }} {{ tr.apellidos }}</div>
                                            <div>
                                                <b>Cédula/RUC:</b>
                                                <span v-if="tr.cedula">{{ tr.cedula }}</span>
                                                <span v-else class="text-gray-500 italic text-danger">(Sin registro)</span>
                                            </div>
                                            <div><b>Email:</b> {{ tr.email || '(Sin registro)' }}</div>
                                            <div><b>Teléfono:</b> {{ tr.telefono || '(Sin registro)' }}</div>
                                            <div><b>Fecha nacimiento:</b> {{ tr.fecha_nacimiento || '(Sin registro)' }}</div>
                                        </div>
                                    </vs-td>
                                    <vs-td>
                                        <div class="flex space-x-2">
                                            <div v-if="estaSeleccionado(tr)">
                                                <span class="text-green-600 font-semibold flex items-center">
                                                    <i class="feather icon-check mr-1"></i> Seleccionado
                                                </span>
                                            </div>
                                            <div v-else>
                                                <vx-tooltip text="Seleccionar como personal del plantel" position="top" color="primary">
                                                    <vs-button size="small" color="primary" type="filled" icon-pack="feather" icon="icon-check" @click="seleccionarUsuario(tr)">
                                                        Seleccionar
                                                    </vs-button>
                                                </vx-tooltip>
                                            </div>
                                            <vx-tooltip text="Editar datos del usuario" position="top" color="warning">
                                                <vs-button size="small" color="warning" type="border" icon-pack="feather" icon="icon-edit" @click="verificarcrear_actualizarUsuario = 'update'; Button_CrearEditarUsuario(tr)">
                                                    Editar
                                                </vs-button>
                                            </vx-tooltip>
                                        </div>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>

                    <!-- 🚫 Si no hay docentes -->
                    <div v-else>
                        <vs-alert color="warning" title="Sin resultados">
                            <div class="no-result-box">
                                <p class="info-text">
                                    No hay usuarios docentes registrados para esta institución.
                                </p>
                            </div>
                        </vs-alert>
                    </div>
                </div>
                <!-- POPUP CREAR / EDITAR USUARIO -->
                <vs-popup class="informacionformhijodehijodehijo" :title="verificarcrear_actualizarUsuario === 'create'
                        ? 'Registrar nuevo usuario'
                        : 'Actualizar usuario - Cédula: ' + itemUsuarioPlantelEnviar.cedula" :active.sync="popup_CrearEditarUsuario">
                    <Component_CrearEditarUsuario v-if="popup_CrearEditarUsuario" :institucionSeleccionada="institucionSeleccionada" :itemUsuarioPlantelEnviar="itemUsuarioPlantelEnviar" :verificarcrear_actualizarUsuario="verificarcrear_actualizarUsuario" @change="changeHandle_CrearEditarUsuario" />
                </vs-popup>
            </vs-tab>
            <!--  tab visible -->
            <vs-tab label="Búsqueda de Usuarios" @click="tabSeleccionado()">
                <!-- Aquí va el contenido del tab 'Días' -->
                <!-- ===================== BUSCAR USUARIOS ===================== -->
                <vs-row class="mb-4" align="center">
                    <!-- Fila superior: botón Crear usuario a la derecha -->
                    <vs-col vs-w="12" class="flex justify-end mb-3">
                        <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-user-plus" @click="verificarcrear_actualizarUsuario = 'create'; Button_CrearEditarUsuario()">
                            Crear nuevo usuario
                        </vs-button>
                    </vs-col>
                    <vs-divider>Búsqueda de Usuarios</vs-divider>
                    <!-- Fila inferior: input y botón Buscar centrados -->
                    <vs-col vs-w="12" class="flex justify-center items-center space-x-3 flex-wrap">
                        <vs-input v-model="filtrousuario_buscar" placeholder="Búsque un usuario por cédula, correo o nombre" icon="search" style="width: 100%; max-width: 600px;" @keyup.enter="getRepresentanteAsignar" />
                        <vs-button color="success" type="relief" class="mt-2 sm:mt-0" @click="getRepresentanteAsignar">
                            Buscar
                        </vs-button>
                        <small v-if="encontroresultados == 1" class="text-warning mt-2 w-full text-center sm:text-left">
                            El usuario no existe.
                        </small>
                    </vs-col>
                </vs-row>

                <!-- ===================== TABLA RESULTADOS ===================== -->
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <div v-if="encontroresultados == 2">
                            <vs-divider>Selección del Personal del Plantel</vs-divider>
                            <vs-table max-items="5" search pagination :data="Busqueda_representante_legal" no-data-text="No hay datos disponibles" class="tabla-usuarios">
                                <template slot="thead">
                                    <vs-th width="800">Información del Usuario</vs-th>
                                    <vs-th>Acciones</vs-th>
                                </template>
                                <template slot-scope="{ data }">
                                    <vs-tr v-for="(tr, indextr) in data" :key="indextr" class="fila-usuario">
                                        <vs-td class="info-usuario">
                                            <div class="info-grid">
                                                <div><b>Nombres y Apellidos:</b> {{ tr.nombres }} {{ tr.apellidos }}</div>
                                                <div>
                                                    <b>Cédula/RUC:</b>
                                                    <span v-if="tr.cedula">{{ tr.cedula }}</span>
                                                    <span v-else class="text-gray-500 italic text-danger">(Sin registro)</span>
                                                </div>
                                                <div><b>Email:</b> {{ tr.email || '(Sin registro)' }}</div>
                                                <div><b>Teléfono:</b> {{ tr.telefono || '(Sin registro)' }}</div>
                                                <div><b>Fecha nacimiento:</b> {{ tr.fecha_nacimiento || '(Sin registro)' }}</div>
                                            </div>
                                        </vs-td>
                                        <vs-td>
                                            <div class="flex space-x-2">
                                                <div v-if="estaSeleccionado(tr)">
                                                    <span class="text-green-600 font-semibold flex items-center">
                                                        <i class="feather icon-check mr-1"></i> Seleccionado
                                                    </span>
                                                </div>
                                                <div v-else>
                                                    <vx-tooltip text="Seleccionar como personal del plantel" position="top" color="primary">
                                                        <vs-button size="small" color="primary" type="filled" icon-pack="feather" icon="icon-check" @click="seleccionarUsuario(tr)">
                                                            Seleccionar
                                                        </vs-button>
                                                    </vx-tooltip>
                                                </div>
                                                <vx-tooltip text="Editar datos del usuario" position="top" color="warning">
                                                    <vs-button size="small" color="warning" type="border" icon-pack="feather" icon="icon-edit" @click="verificarcrear_actualizarUsuario = 'update'; Button_CrearEditarUsuario(tr)">
                                                        Editar
                                                    </vs-button>
                                                </vx-tooltip>
                                            </div>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>

                        <!-- Mensaje sin resultados -->
                        <div v-else-if="encontroresultados == 1">
                            <vs-alert color="warning" title="Sin resultados">
                                <div class="no-result-box">
                                    <p class="info-text">No se encontraron usuarios que coincidan con la búsqueda.</p>
                                </div>
                            </vs-alert>
                        </div>
                        <!-- Mensaje de usuario sin permisos -->
                        <div v-else-if="encontroresultados == 3">
                            <vs-alert color="danger" title="Sin permisos">
                                <div class="no-result-box">
                                    <p class="info-text">
                                        El usuario existe, pero no tiene permisos para acceder a esta sección.
                                    </p>
                                </div>
                            </vs-alert>
                        </div>
                    </vs-col>
                </vs-row>
                <!-- POPUP CREAR / EDITAR USUARIO -->
                <vs-popup class="informacionformhijodehijodehijo" :title="verificarcrear_actualizarUsuario === 'create'
                        ? 'Registrar nuevo usuario'
                        : 'Actualizar usuario - Cédula: ' + itemUsuarioPlantelEnviar.cedula" :active.sync="popup_CrearEditarUsuario">
                    <Component_CrearEditarUsuario v-if="popup_CrearEditarUsuario" :institucionSeleccionada="institucionSeleccionada" :itemUsuarioPlantelEnviar="itemUsuarioPlantelEnviar" :verificarcrear_actualizarUsuario="verificarcrear_actualizarUsuario" @change="changeHandle_CrearEditarUsuario" />
                </vs-popup>
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>

<script>
const Component_CrearEditarUsuario = () => import("@/views/pedidos2/fichero_mercado/Agregar_Editar_Usuario.vue");
export default {
    data() {
        return {
            Busqueda_representante_legal: [],
            Docentes_de_Institucion: [],
            filtrousuario_buscar: "",
            encontroresultados: 0,
            popup_CrearEditarUsuario: false,
            verificarcrear_actualizarUsuario: 'create',
            itemUsuarioPlantelEnviar: {},
            activeTab: 0,
            isHistoryBack: false // Control para historial
        };
    },
    props: {
        Enviar_UsuariosPlantelSelect: {
            type: Array,
            default: () => []
        },
        institucionSeleccionada: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        Component_CrearEditarUsuario,
    },
    mounted() {
        this.tabSeleccionado();
        window.addEventListener('popstate', this.handlePopState);
    },
    beforeDestroy() {
        window.removeEventListener('popstate', this.handlePopState);
    },
    watch: {
        popup_CrearEditarUsuario(val) {
            console.log(`👀 Watcher Nieto (popup_CrearEditarUsuario): ${val}, isHistoryBack: ${this.isHistoryBack}`);
            if (val) {
                // Evitar duplicar
                if (history.state && history.state.popup_CrearEditarUsuario) {
                     console.log('   -> State ya tiene popup_CrearEditarUsuario: true, saltamos pushState.');
                     this.isHistoryBack = false;
                     return;
                }

                // Preservamos historial del padre (Nivel 2) y abuelo (Nivel 1)
                let newState = { ...history.state, popup_CrearEditarUsuario: true };
                window.history.pushState(newState, '');
                console.log('   -> PushState ejecutado en Nieto');
                this.isHistoryBack = false;
            } else {
                if (!this.isHistoryBack) {
                    console.log('   -> Ejecutando history.back() manual en Nieto');
                    window.history.back();
                } else {
                    console.log('   -> Cierre por popstate, NO hacemos history.back()');
                }
                this.isHistoryBack = false;
            }
        }
    },
    methods: {
        handlePopState(event) {
            // console.log("📍 Nieto (Asignacion_Usuarios) - popstate detectado.");
            // console.log("   - State del evento:", event.state);
            // console.log("   - popup_CrearEditarUsuario (antes):", this.popup_CrearEditarUsuario);
            this.isHistoryBack = true;
            if (this.popup_CrearEditarUsuario) {
                // Al ser el último nivel, simplemente cerramos el popup al detectar navegación
                this.$nextTick(() => {
                    this.popup_CrearEditarUsuario = false;
                    // console.log("   - popup_CrearEditarUsuario set a FALSE");
                });
            } else {
                this.isHistoryBack = false;
                // console.log("   - El popup no estaba abierto, ignorando.");
            }
        },
        tabSeleccionado() {
            if (this.activeTab === 0) {
                // Ejecutar método cuando se entra al tab 0
                console.log("Tab 0 seleccionado");
                this.getDocentesInstitucion(); // reemplaza con el método real que quieras ejecutar
            } else if (this.activeTab === 1) {
                // Ejecutar método cuando se entra al tab 1
                console.log("Tab 1 seleccionado");
                this.Busqueda_representante_legal = [];
                this.filtrousuario_buscar = "";
                this.encontroresultados = 0;
            }
        },
        estaSeleccionado(tr) {
            return this.Enviar_UsuariosPlantelSelect.some(u => u.idusuario === tr.idusuario);
        },
        getRepresentanteAsignar() {
            if (this.filtrousuario_buscar.trim().length <= 1) {
                this.$vs.notify({
                    text: "La búsqueda debe ser mayor a 4 caracteres.",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-check"
                });
                return;
            }

            this.$vs.loading();
            let params = {
                action: "Get_Busqueda_Representante_Institucion",
                filtrousuario_buscar: this.filtrousuario_buscar
            };

            this.$http
                .get(this.$server_url + "VerifcarMetodosGet_UsuarioController", {
                    params
                })
                .then(res => {
                    const data = res.data;
                    this.$vs.loading.close();

                    // 🔹 Manejamos los tres casos posibles:
                    if (data.status === "ok") {
                        this.Busqueda_representante_legal = data.data;
                        this.encontroresultados = 2; // mostrar tabla
                    } else if (data.status === "sin_permiso") {
                        this.encontroresultados = 3; // nuevo estado para mostrar mensaje especial
                    } else {
                        this.encontroresultados = 1; // sin resultados
                    }
                })
                .catch(() => this.$vs.loading.close());
        },
        getDocentesInstitucion() {
            // console.log(this.institucionSeleccionada.idInstitucion, "sssss");
            // return
            this.$vs.loading();
            let params = {
                action: "Get_Busqueda_UsuarioDocentesx_Institucion",
                idInstitucion: this.institucionSeleccionada.idInstitucion
            };

            this.$http
                .get(this.$server_url + "VerifcarMetodosGet_UsuarioController", {
                    params
                })
                .then(res => {
                    this.Docentes_de_Institucion = res.data
                    this.$vs.loading.close();

                })
                .catch(() => this.$vs.loading.close());
        },
        // ✅ Nuevo método: emite inmediatamente al seleccionar
        seleccionarUsuario(tr) {
            const yaEnPlantel = this.Enviar_UsuariosPlantelSelect.find(u => u.idusuario === tr.idusuario);
            if (yaEnPlantel) {
                this.$vs.notify({
                    text: "El usuario ya está agregado en el fichero de mercado.",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-circle"
                });
                return;
            }

            // Emitimos el usuario directamente (misma estructura que antes)
            this.$emit("change", {
                verificaragregarusuarioplantel: 1,
                usuarios: [tr] // sigue siendo un array para compatibilidad
            });

            this.$vs.notify({
                text: "Usuario agregado correctamente al fichero de mercado.",
                color: "success",
                iconPack: "feather",
                icon: "icon-check"
            });
        },

        Button_CrearEditarUsuario(tr) {
            if (this.verificarcrear_actualizarUsuario === 'create') {
                this.popup_CrearEditarUsuario = true;
            } else if (this.verificarcrear_actualizarUsuario === 'update') {
                this.itemUsuarioPlantelEnviar = tr;
                this.popup_CrearEditarUsuario = true;
            }
        },

        changeHandle_CrearEditarUsuario(e) {
            if (e.verificar_CrearEditarUsuario == 1) {
                this.popup_CrearEditarUsuario = false;
                this.filtrousuario_buscar = e.email;
                this.getRepresentanteAsignar();
                this.getDocentesInstitucion();
            } else if (e.verificar_CrearEditarUsuario == 2) {
                this.popup_CrearEditarUsuario = false;
            }
        }
    }
};
</script>

<style scoped>
.row-highlight {
    background-color: #c6f6d5 !important;
    transition: background-color 1.5s ease;
}

.no-results-wrapper {
    margin-top: 20px;
    text-align: center;
}

.action-box {
    background: #f9fafc;
    padding: 20px;
    border-radius: 12px;
    display: inline-block;
    margin-top: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.info-text {
    font-size: 14px;
    color: #555;
    margin-bottom: 12px;
}

.create-user-btn {
    border-radius: 8px;
    font-weight: 600;
    padding: 10px 20px;
}

.informacionformhijodehijodehijo {
    z-index: 51003;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

.tabla-usuarios {
    border-radius: 12px;
    overflow: hidden;
    font-size: 14px;
}

/* Fila con fondo alternado y efecto hover */
.fila-usuario {
    transition: background-color 0.25s ease, transform 0.15s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.fila-usuario:nth-child(odd) {
    background-color: rgba(240, 240, 240, 0.4);
}

.info-usuario {
    padding: 12px 16px;
    line-height: 1.5;
}

/* Distribuye los datos en dos columnas */
.info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px 20px;
}

/* Responsive: en pantallas pequeñas, una sola columna */
@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
    }
}
</style>
