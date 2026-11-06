<template>
<vs-row class="transferencia-container">
    <!-- Título -->
    <vs-col vs-w="12" class="text-center mb-6">
        <h3 class="transferencia-titulo">Transferencia de Actividades</h3>
        <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-4 rounded shadow-md inline-block text-left max-w-3xl mx-auto">
            <p class="text-base">
                <strong>Importante:</strong> Solo se transferirán las actividades que tengan <strong>el mismo nombre de tema</strong> y <strong>el mismo número de unidad</strong>.
                Si alguno de estos no coincide, se desplegará una lista de los <strong>NO transferidos</strong>.
            </p>
        </div>
    </vs-col>
    <!-- Contenedor Origen → Destino -->
    <vs-col vs-w="12" class="mb-5">
        <div class="transferencia-table">
            <!-- Origen -->
            <div class="origen">
                <!-- {{ Origen_asignaturaSelect }} -->
                <label class="label-estilo">Origen</label>
                <v-select v-model="Origen_asignaturaSelect" :options="AsignaturasEnviar" :reduce="_origen => _origen" label="nombreasignatura" placeholder="Seleccione la asignatura de origen" ref="Origen_asignaturaSelect" :class="classvalidar_Origen_asignaturaSelect" @input="ValidacionSelect_Origen()" @open="espacioDropdown = true" @close="espacioDropdown = false" />
            </div>
            <!-- Flecha -->
            <div class="flecha">
                <i class="fas fa-arrow-right text-xl"></i>
            </div>
            <!-- Destino -->
            <div class="destino">
                <label class="label-estilo">Destino</label>
                <v-select v-model="Destino_asignaturaSelect" :options="Asignaturas_filtradas_Destino" :reduce="asig_destino => asig_destino" label="nombreasignatura" placeholder="Seleccione la asignatura de destino" ref="Destino_asignaturaSelect" :disabled="!Origen_asignaturaSelect" :class="classvalidar_Destino_asignaturaSelect" @input="ValidacionSelect_Destino()" @open="espacioDropdown = true" @close="espacioDropdown = false" />
            </div>
            <!-- <div style="height: 250px" v-if="Origen_asignaturaSelect == '' && Destino_asignaturaSelect == ''"></div> -->
        </div>
        <div v-if="espacioDropdown && (Origen_asignaturaSelect == '' && Destino_asignaturaSelect == '')" style="height: 350px; pointer-events: none;"></div>
    </vs-col>
    <!-- Tablas de comparación -->
    <vs-col vs-w="12" class="tablas-container">
        <div class="tablas-flex">
            <!-- Tabla Origen -->
            <div class="tabla-origen" v-if="Temas_Origen.length > 0">
                <h4 class="titulo-tabla">Act/Anim de Origen</h4>
                <vs-chip color="primary">
                    Cantidad: {{ Temas_Origen.length }}
                </vs-chip>
                <!-- {{ Act_Anim_Seleccionadas }} -->
                <vs-table multiple stripe pagination max-items="10" v-model="Act_Anim_Seleccionadas" :data="mostrarSoloFaltantes ? Temas_Origen_Filtrados : Temas_Origen" search no-data-text="No hay datos disponibles">
                    <template slot="thead">
                        <vs-th>Unidad</vs-th>
                        <vs-th>Nombre del Tema</vs-th>
                        <vs-th>Información Act/Anim</vs-th>
                    </template>
                    <template slot-scope="{ data }">
                        <vs-tr :key="tr.id" v-for="tr in data" :data="tr">
                            <vs-td>{{ tr.unidad }}.- {{ tr.nombre_unidad }}</vs-td>
                            <vs-td>{{ tr.nombre_tema }}</vs-td>
                            <vs-td>
                                <span><b>Página: </b> {{ tr.page }}</span><br>
                                <span><b>Link: </b> {{ tr.link }}</span><br>
                                <span><b>Tipo: </b>
                                    <span v-if="tr.tipo == 0"> Actividad</span>
                                    <span v-if="tr.tipo == 1"> Animación</span>
                                </span>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <!-- Contenedor central -->
            <div class="centro-comparacion" v-if="Temas_Origen.length > 0 && Temas_Destino.length > 0">
                <vs-button color="primary" icon="compare_arrows" type="filled" @click="compararTemas">
                    {{ mostrarSoloFaltantes ? 'Mostrar todos los temas' : 'Comparar y mostrar faltantes' }}
                </vs-button>
                <vs-alert color="warning" icon="warning" v-if="mensajeComparacion" class="mt-3 text-center">
                    {{ mensajeComparacion }}
                </vs-alert>
                <!-- Mensaje de selección -->
                <div v-if="Act_Anim_Seleccionadas.length > 0" class="mt-3 text-center">
                    <vs-alert color="success" icon="check_circle">
                        Has seleccionado <b>{{ Act_Anim_Seleccionadas.length }}</b>
                        {{ Act_Anim_Seleccionadas.length === 1 ? 'actividad' : 'actividades' }} para transferencia.
                    </vs-alert>
                </div>
            </div>
            <!-- Tabla Destino -->
            <div class="tabla-destino" v-if="Temas_Destino.length > 0">
                <h4 class="titulo-tabla">Act/Anim de Destino</h4>
                <vs-chip color="primary">
                    Cantidad: {{ Temas_Destino.length }}
                </vs-chip>
                <vs-table stripe pagination max-items="10" :data="Temas_Destino" search no-data-text="No hay datos disponibles">
                    <template slot="thead">
                        <vs-th>Unidad</vs-th>
                        <vs-th>Nombre del Tema</vs-th>
                        <vs-th>Información Act/Anim</vs-th>
                    </template>
                    <template slot-scope="{ data }">
                        <vs-tr v-for="tr in data" :key="tr.id">
                            <vs-td>{{ tr.unidad }}.- {{ tr.nombre_unidad }}</vs-td>
                            <vs-td>{{ tr.nombre_tema }}</vs-td>
                            <vs-td>
                                <span><b>Página:</b> {{ tr.page }}</span><br>
                                <span><b>Link:</b> {{ tr.link }}</span><br>
                                <span><b>Tipo: </b>
                                    <span v-if="tr.tipo == 0"> Actividad</span>
                                    <span v-if="tr.tipo == 1"> Animación</span>
                                </span>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
    </vs-col>
    <vs-col vs-w="12" class="text-center mt-4 mb-4">
        <vs-button color="primary" type="filled" :disabled="(!Origen_asignaturaSelect || !Destino_asignaturaSelect) || Act_Anim_Seleccionadas.length == 0" @click="CompletarTransferencia()">
            Transferir Actividades
        </vs-button>
    </vs-col>
    <!-- Resumen de actividades transferidas -->
    <!-- ✅ ACTIVIDADES TRANSFERIDAS -->
    <vs-col vs-w="12" v-if="actividadesTransferidos.length > 0" class="mb-5">
        <div style="border:1px solid #38a169;border-radius:8px; overflow:hidden;">
            <button @click="toggleCollapse('transferidos')" style="width:100%; display:flex; justify-content:space-between; align-items:center; padding:12px 16px; color:#22543d; font-weight:600; cursor:pointer;">
                <span>
                    ✅ Actividades transferidas exitosamente
                    <span style="margin-left:8px; background:#38a169; color:white; font-size:12px; padding:2px 8px; border-radius:12px;">
                        {{ actividadesTransferidos.length }}
                    </span>
                </span>
                <svg style="width:20px; height:20px; transition:transform 0.3s;" :style="{ transform: collapseOpen === 'transferidos' ? 'rotate(180deg)' : 'rotate(0deg)' }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <transition name="fade">
                <div v-show="collapseOpen === 'transferidos'" style="padding:16px; background:white;">
                    <table style="width:100%; border-collapse:collapse; font-size:14px; color:#2d3748;">
                        <thead>
                            <tr style="background:#38a169; color:white;">
                                <th style="padding:8px;">Nueva ID</th>
                                <th style="padding:8px;">Tema Origen</th>
                                <th style="padding:8px;">Unidad Origen</th>
                                <th style="padding:8px;">Tema Destino</th>
                                <th style="padding:8px;">Unidad Destino</th>
                                <th style="padding:8px;">Asignatura</th>
                                <th style="padding:8px;">Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(act, idx) in actividadesTransferidos" :key="idx" style="background:white; border-top:1px solid #e2e8f0; transition:background 0.2s;" @mouseover="hoverRow = idx" @mouseleave="hoverRow = null" :style="{ background: hoverRow === idx ? '#f0fff4' : 'white' }">
                                <td style="padding:8px; text-align:center;">{{ act.nuevo_id_item }}</td>
                                <td style="padding:8px;">{{ act.nombre_tema_origen }}</td>
                                <td style="padding:8px;">{{ act.nombre_unidad_origen }}</td>
                                <td style="padding:8px;">{{ act.nombre_tema_destino }}</td>
                                <td style="padding:8px;">{{ act.nombre_unidad_destino }}</td>
                                <td style="padding:8px;">{{ act.asignatura_destino }}</td>
                                <td style="padding:8px;">{{ act.tipo }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </transition>
        </div>
    </vs-col>

    <!-- ⚠️ NO TRANSFERIDAS -->
    <vs-col vs-w="12" v-if="actividadesNoTransferidos.length > 0">
        <div style="border:1px solid #e53e3e; border-radius:8px; overflow:hidden;">
            <button @click="toggleCollapse('noTransferidos')" style="width:100%; display:flex; justify-content:space-between; align-items:center; padding:12px 16px; color:#742a2a; font-weight:600; cursor:pointer;">
                <span>
                    ⚠️ Actividades que no se pudieron transferir
                    <span style="margin-left:8px; background:#e53e3e; color:white; font-size:12px; padding:2px 8px; border-radius:12px;">
                        {{ actividadesNoTransferidos.length }}
                    </span>
                </span>
                <svg style="width:20px; height:20px; transition:transform 0.3s;" :style="{ transform: collapseOpen === 'noTransferidos' ? 'rotate(180deg)' : 'rotate(0deg)' }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <transition name="fade">
                <div v-show="collapseOpen === 'noTransferidos'" style="padding:16px; background:white;">
                    <table style="width:100%; border-collapse:collapse; font-size:14px; color:#2d3748;">
                        <thead>
                            <tr style="background:#e53e3e; color:white;">
                                <th style="padding:8px;">Tema</th>
                                <th style="padding:8px;">Unidad</th>
                                <!-- <th style="padding:8px;">Asignatura</th> -->
                                <th style="padding:8px;">Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(actividad, index) in actividadesNoTransferidos" :key="index" style="background:white; border-top:1px solid #e2e8f0;" @mouseover="hoverRow = index + 1000" @mouseleave="hoverRow = null" :style="{ background: hoverRow === index + 1000 ? '#fff5f5' : 'white' }">
                                <td style="padding:8px;">{{ actividad.nombre_tema_origen }}</td>
                                <td style="padding:8px;">{{ actividad.unidad_origen }}.- {{ actividad.nombre_unidad_origen }}</td>
                                <!-- <td style="padding:8px;">{{ actividad.asignatura_destino }}</td> -->
                                <td style="padding:8px; color:#c53030;">{{ actividad.razon }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </transition>
        </div>
    </vs-col>

    <!-- ⚠️ YA REGISTRADAS -->
    <vs-col vs-w="12" v-if="actividadesYaRegistradas.length > 0">
        <div style="border:1px solid #d69e2e; border-radius:8px; overflow:hidden;">
            <button @click="toggleCollapse('yaRegistradas')" style="width:100%; display:flex; justify-content:space-between; align-items:center; padding:12px 16px; color:#744210; font-weight:600; cursor:pointer;">
                <span>
                    ⚠️ Actividades ya registradas en el destino
                    <span style="margin-left:8px; background:#d69e2e; color:white; font-size:12px; padding:2px 8px; border-radius:12px;">
                        {{ actividadesYaRegistradas.length }}
                    </span>
                </span>
                <svg style="width:20px; height:20px; transition:transform 0.3s;" :style="{ transform: collapseOpen === 'yaRegistradas' ? 'rotate(180deg)' : 'rotate(0deg)' }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <transition name="fade">
                <div v-show="collapseOpen === 'yaRegistradas'" style="padding:16px; background:white;">
                    <table style="width:100%; border-collapse:collapse; font-size:14px; color:#2d3748;">
                        <thead>
                            <tr style="background:#d69e2e; color:white;">
                                <th style="padding:8px;">Tema</th>
                                <th style="padding:8px;">Unidad</th>
                                <th style="padding:8px;">Asignatura</th>
                                <th style="padding:8px;">Link</th>
                                <th style="padding:8px;">Página</th>
                                <th style="padding:8px;">Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(actividad, index) in actividadesYaRegistradas" :key="index" style="background:white; border-top:1px solid #e2e8f0;" @mouseover="hoverRow = index + 2000" @mouseleave="hoverRow = null" :style="{ background: hoverRow === index + 2000 ? '#fffaf0' : 'white' }">
                                <td style="padding:8px;">{{ actividad.nombre_tema_destino }}</td>
                                <td style="padding:8px;">{{ actividad.nombre_unidad_destino }}</td>
                                <td style="padding:8px;">{{ actividad.asignatura_destino }}</td>
                                <td style="padding:8px; word-break:break-all;">{{ actividad.link }}</td>
                                <td style="padding:8px; text-align:center;">{{ actividad.page }}</td>
                                <td style="padding:8px; text-align:center;">{{ actividad.tipo }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </transition>
        </div>
    </vs-col>

</vs-row>
</template>

<script>
import vSelect from "vue-select";
export default {
    data() {
        return {
            librosFiltrados: [],
            libroSelecttranferir: '',
            classvalidar_Origen_asignaturaSelect: '',
            classvalidar_Destino_asignaturaSelect: '',
            libroOrigen: null,
            Origen_asignaturaSelect: '',
            Destino_asignaturaSelect: '',
            Asignaturas_filtradas_Destino: [],
            actividadesTransferidos: [],
            actividadesNoTransferidos: [],
            actividadesYaRegistradas: [],
            collapseOpen: null, // guarda qué collapse está abierto
            hoverRow: null,
            Temas_Origen: [],
            Temas_Destino: [],
            Act_Anim_Seleccionadas: [],
            mostrarSoloFaltantes: false,
            mensajeComparacion: '',
            Temas_Origen_Filtrados: [],
            espacioDropdown: false,
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        AsignaturasEnviar: {
            type: Array,
            default: [],
        },
    },
    mounted() {},
    methods: {
        async ValidacionSelect_Origen() {
            try {
                this.Temas_Origen = [];
                this.actividadesTransferidos = [];
                this.actividadesNoTransferidos = [];
                this.actividadesYaRegistradas = [];
                this.Act_Anim_Seleccionadas = [];
                this.mostrarSoloFaltantes = false;
                if (!this.Origen_asignaturaSelect || !this.Origen_asignaturaSelect.idasignatura) {
                    this.Origen_asignaturaSelect = '';
                    this.Destino_asignaturaSelect = '';
                    this.Temas_Destino = [];
                    this.refrescarComparacion();
                    this.validarcampo_buscar_Origen_asignaturaSelect();
                    return;
                }
                this.$vs.loading();
                this.Destino_asignaturaSelect = '';
                this.Temas_Destino = [];
                // this.Destino_asignaturaSelect = '';
                this.Asignaturas_filtradas_Destino = this.AsignaturasEnviar.filter(asig => asig.idasignatura != this.Origen_asignaturaSelect.idasignatura);
                await this.get_Buscar_Actividades_x_Asignatura_Origen();
                await this.validarcampo_buscar_Destino_asignaturaSelect();
                this.refrescarComparacion();
                this.$vs.loading.close();
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error en ValidacionSelect_Origen:', error);
            }
        },
        async ValidacionSelect_Destino() {
            try {
                this.Temas_Destino = [];
                this.actividadesTransferidos = [];
                this.actividadesNoTransferidos = [];
                this.actividadesYaRegistradas = [];
                this.Act_Anim_Seleccionadas = [];
                this.mostrarSoloFaltantes = false;
                if (!this.Destino_asignaturaSelect || !this.Destino_asignaturaSelect.idasignatura) {
                    this.Destino_asignaturaSelect = '';
                    this.refrescarComparacion();
                    this.validarcampo_buscar_Destino_asignaturaSelect();
                    return;
                }
                this.$vs.loading();
                await this.get_Buscar_Actividades_x_Asignatura_Destino();
                this.refrescarComparacion();
                this.$vs.loading.close();
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error en ValidacionSelect_Destino:', error);
            }
        },
        validarcampo_buscar_Origen_asignaturaSelect() {
            let me = this;
            return new Promise((resolve, reject) => {
                me.classvalidar_Origen_asignaturaSelect = 'stylevalidar';
                me.$nextTick(() => {
                    const input = me.$refs.Origen_asignaturaSelect &&
                        me.$refs.Origen_asignaturaSelect.$el &&
                        me.$refs.Origen_asignaturaSelect.$el.querySelector('input');
                    if (input) input.focus();
                });
                me.$vs.notify({
                    text: "Seleccione la asignatura de origen.",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 8000,
                });
                setTimeout(() => {
                    me.classvalidar_Origen_asignaturaSelect = '';
                }, 1500);
                resolve();
            });
        },
        validarcampo_buscar_Destino_asignaturaSelect() {
            let me = this;
            return new Promise((resolve, reject) => {
                me.classvalidar_Destino_asignaturaSelect = 'stylevalidar';
                me.$nextTick(() => {
                    const input = me.$refs.Destino_asignaturaSelect &&
                        me.$refs.Destino_asignaturaSelect.$el &&
                        me.$refs.Destino_asignaturaSelect.$el.querySelector('input');
                    if (input) input.focus();
                });
                me.$vs.notify({
                    text: "Seleccione la asignatura de destino.",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 8000,
                });
                setTimeout(() => {
                    me.classvalidar_Destino_asignaturaSelect = '';
                }, 1500);
                resolve();
            });
        },
        async get_Buscar_Actividades_x_Asignatura_Origen() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Buscar_Actividades_x_Asignatura',
                    id_asignatura: this.Origen_asignaturaSelect.idasignatura
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_ActividadAnimacionController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (response.data && response.data.length > 0) {
                            this.Temas_Origen = response.data;
                            resolve();
                        } else {
                            resolve();
                        }
                    })
                    .catch(error => {
                        console.error('Error al buscar instituciones:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getVerificar_Existencia_Fichero", error);
                    });
            });
        },
        async get_Buscar_Actividades_x_Asignatura_Destino() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Buscar_Actividades_x_Asignatura',
                    id_asignatura: this.Destino_asignaturaSelect.idasignatura
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_ActividadAnimacionController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (response.data && response.data.length > 0) {
                            this.Temas_Destino = response.data;
                            resolve();
                        } else {
                            resolve();
                        }
                    })
                    .catch(error => {
                        console.error('Error al buscar instituciones:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getVerificar_Existencia_Fichero", error);
                    });
            });
        },
        CompletarTransferencia() {
            let me = this;
            // Validar selects
            if (!me.Origen_asignaturaSelect) {
                me.validarcampo_buscar_Origen_asignaturaSelect();
                return;
            }
            if (!me.Destino_asignaturaSelect) {
                me.validarcampo_buscar_Destino_asignaturaSelect();
                return;
            }
            me.$vs.loading();
            let usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
            let user_created = usuarioLocal.idusuario;
            let datos = {
                "Act_Anim_Seleccionadas": me.Act_Anim_Seleccionadas,
                "asignatura_recibir_transferencia": me.Destino_asignaturaSelect,
                "user_created": user_created
            };
            console.log(datos, "Datos a enviar");
            me.$http.post(me.$server_url + 'Transferencia_ActividadesyAnimaciones_Asignatura', datos)
                .then(res => {
                    me.$vs.loading.close();
                    // Asignar datos correctos desde el backend
                    me.actividadesTransferidos = res.data.transferidos || [];
                    me.actividadesNoTransferidos = res.data.no_transferidos || [];
                    me.actividadesYaRegistradas = res.data.ya_existian || [];
                    if (res.data.status == 1) {
                        me.Act_Anim_Seleccionadas = [];
                        me.mostrarSoloFaltantes = true;
                        me.compararTemas();
                        if (me.actividadesTransferidos.length > 0) {
                            me.$vs.notify({
                                text: `✅ ${me.actividadesTransferidos.length} actividad/es transferidas correctamente.`,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        if (me.actividadesNoTransferidos.length > 0) {
                            me.$vs.notify({
                                text: `⚠️ ${me.actividadesNoTransferidos.length} actividad/es no se pudieron transferir.`,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            });
                        }
                        if (me.actividadesYaRegistradas.length > 0) {
                            me.$vs.notify({
                                text: `⚠️ ${me.actividadesYaRegistradas.length} actividad/es con el mismo link y página ya estan registradas.`,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            });
                        }
                    }
                })
                .catch(() => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al transferir actividades',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                });
        },
        async compararTemas() {
            if (this.Temas_Origen.length === 0 || this.Temas_Destino.length === 0) {
                this.$vs.notify({
                    color: 'warning',
                    title: 'Atención',
                    text: 'Debe tener datos tanto en origen como en destino para comparar.'
                });
                return;
            }
            this.$vs.loading();
            this.Act_Anim_Seleccionadas = [];
            await this.get_Buscar_Actividades_x_Asignatura_Origen();
            await this.get_Buscar_Actividades_x_Asignatura_Destino();
            // Cambiar modo
            this.mostrarSoloFaltantes = !this.mostrarSoloFaltantes;
            // ✅ Llamar a la nueva función que actualiza correctamente según el modo actual
            this.refrescarComparacion();
        },
        async refrescarComparacion() {
            // Si está mostrando solo los faltantes, recalcula el filtro
            return new Promise((resolve, reject) => {
                try {
                    if (this.mostrarSoloFaltantes) {
                        const faltantes = this.Temas_Origen.filter(origen => {
                            return !this.Temas_Destino.some(destino =>
                                destino.nombre_tema.trim().toLowerCase() === origen.nombre_tema.trim().toLowerCase() &&
                                destino.unidad === origen.unidad &&
                                destino.page === origen.page &&
                                destino.link.trim() === origen.link.trim() &&
                                destino.tipo === origen.tipo
                            );
                        });
                        this.Temas_Origen_Filtrados = faltantes;
                        this.mensajeComparacion = `Se encontró ${faltantes.length} act/anim que no existen en la asignatura destino.`;
                        this.$vs.loading.close();
                    } else {
                        // Si no está filtrando, mostrar todo
                        this.Temas_Origen_Filtrados = [...this.Temas_Origen];
                        this.mensajeComparacion = '';
                        this.$vs.loading.close();
                    }
                    resolve();
                } catch (error) {
                    this.$vs.loading.close();
                    console.error('Error al refrescar la comparación:', error);
                    reject(error);
                }
            });
        },
        toggleCollapse(section) {
            this.collapseOpen = this.collapseOpen === section ? null : section;
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
    },
};
</script>

<style scoped>
.informacionformhijodehijo {
    z-index: 51002;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}

.stylevalidar {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

.transferencia-container {
    /* max-width: 600px; */
    margin: 0 auto;
    padding: 1.5rem 1rem;
    background-color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.transferencia-titulo {
    font-weight: 700;
    font-size: 1.8rem;
    color: #1e293b;
    /* azul grisáceo */
    margin-bottom: 1.5rem;
}

.label-estilo {
    font-weight: 600;
    font-size: 0.9rem;
    color: #475569;
    /* gris oscuro */
    margin-bottom: 0.4rem;
    display: block;
}

.vs-button--filled {
    border-radius: 10px;
    padding: 0.6rem 2rem;
    font-weight: 600;
    font-size: 1.1rem;
    transition: background-color 0.3s ease;
}

.vs-button--filled:hover:not(:disabled) {
    background-color: #1e40af;
    /* azul oscuro */
}

.vs-button--disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
}

/* Responsive: en pantallas pequeñas, el padding es más compacto */
@media (max-width: 480px) {
    .transferencia-container {
        padding: 1rem 0.5rem;
    }

    .transferencia-titulo {
        font-size: 1.5rem;
    }

    .vs-button--filled {
        width: 100%;
        padding: 0.7rem 0;
        font-size: 1rem;
    }
}

.transferencia-table {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    max-width: 800px;
    margin: 0 auto;
}

.origen,
.destino {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
}

.flecha {
    text-align: center;
    font-size: 2rem;
    color: #4CAF50;
}

@media (max-width: 768px) {
    .transferencia-table {
        flex-direction: column;
        gap: 20px;
    }

    .origen,
    .destino {
        min-width: 100%;
        max-width: 100%;
    }

    .flecha {
        margin: 10px 0;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

.transferencia-container {
    padding: 20px;
}

.transferencia-table {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
}

.origen,
.destino {
    width: 320px;
}

.flecha {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #2563eb;
}

/* --- Tablas lado a lado --- */
.tablas-flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    position: relative;
}

.tabla-origen,
.tabla-destino {
    flex: 1 1 48%;
    min-width: 300px;
}

.titulo-tabla {
    text-align: center;
    font-weight: bold;
    color: #1e3a8a;
    margin-bottom: 10px;
}

.centro-comparacion {
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

/* --- Responsive móvil: las tablas se apilan --- */
@media (max-width: 768px) {
    .tablas-flex {
        flex-direction: column;
        align-items: center;
        /* ✅ esto centra las tablas cuando están en columna */
    }

    .tabla-origen,
    .tabla-destino {
        width: 100%;
        /* ✅ que ocupen todo el ancho disponible */
        max-width: 600px;
        /* opcional, límite de ancho */
    }

    .centro-comparacion {
        width: auto;
        margin: 15px 0;
    }
}
</style>
