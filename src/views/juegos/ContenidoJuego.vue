<template>
<div>
    <vs-prompt @cancel="activePromptEliminar=false;" @accept="eliminarJuego()" @close="activePromptEliminar=false;" :active.sync="activePromptEliminar" color="danger" title="Confirmar" acceptText="Aceptar" cancelText="Cancelar">
        <div class="con-exemple-prompt">
            ¿Está seguro de eliminar este juego?
        </div>
    </vs-prompt>
    <vx-card v-bind:title="nombre_tipo_juego">

        <!-- BARRA DE FILTROS -->
        <div class="mb-4 mt-2">
            <div class="vx-row sm:flex-col lg:flex-row align-center w-full">
                <!-- Filtro Asignatura -->
                <div class="vx-col w-full lg:w-3/12 mb-2">
                    <span class="text-sm font-semibold opacity-75">Filtrar por Asignatura</span>
                    <v-select
                        v-model="filtro.asignatura"
                        :options="asignaturasUnicas"
                        placeholder="Todas las Asignaturas"
                        class="w-full"
                        clearable
                    />
                </div>
                <!-- Filtro Nivel -->
                <div class="vx-col w-full lg:w-2/12 mb-2">
                    <span class="text-sm font-semibold opacity-75">Filtrar por Perfil</span>
                    <v-select
                        v-model="filtro.nivel"
                        :options="nivelesUnicos"
                        placeholder="Todos los Perfiles"
                        class="w-full"
                        clearable
                    />
                </div>
                <!-- Filtro Estado -->
                <div class="vx-col w-full lg:w-3/12 mb-2">
                    <span class="text-sm font-semibold opacity-75">Estado</span>
                    <v-select
                        v-model="filtro.estado"
                        :options="[{label:'Todos', value: null}, {label:'Activo', value: 'Activo'}, {label:'Inactivo', value: 'Inactivo'}]"
                        :reduce="opt => opt.value"
                        placeholder="Todos"
                        class="w-full"
                    />
                </div>
                <!-- Filtro Rango de Fechas -->
                <div class="vx-col w-full lg:w-3/12 mb-2">
                    <span class="text-sm font-semibold opacity-75">Fecha Creación</span>
                    <flat-pickr
                        class="w-full"
                        v-model="filtro.fecha"
                        :config="configFecha"
                        placeholder="Seleccione rango de fecha..."
                    />
                </div>
                <!-- Botón Limpiar -->
                <div class="vx-col w-full lg:w-1/12 mb-2 flex items-end">
                    <vx-tooltip text="Limpiar Filtros" position="top">
                        <vs-button radius color="dark" type="border" icon-pack="feather" icon="icon-filter" @click="limpiarFiltros" class="w-full h-10 mt-5 flex justify-center items-center">
                        </vs-button>
                    </vx-tooltip>
                </div>
            </div>
        </div>
        <vs-divider class="mt-0 opacity-50"/>

        <!-----listado juegos--------->
        <p class="mb-2">Cantidad: <b>{{juegosFiltrados.length}}</b> <span v-if="juegos.length !== juegosFiltrados.length" class="text-sm opacity-75">(de {{ juegos.length }} totales)</span></p>
        <vs-table stripe pagination max-items="25" search :data="juegosFiltrados" v-if="juegosFiltrados != undefined && juegosFiltrados.length>0">
            <template slot="header">
                <vs-button color="primary" class="mr-2" type="border" icon-pack="feather" @click="$router.go(-1)" icon="icon-arrow-left">Volver</vs-button>
                <vs-button @click="irCrearjuego('')" color="dark" type="filled">Crear juego</vs-button>
            </template>
            <template slot="thead">
                <vs-th sort-key="nombre_juego">Juegos</vs-th>
                <vs-th sort-key="temas">Unidad - tema</vs-th>
                <vs-th sort-key="creador">Creador</vs-th>
                <!-- <vs-th sort-key="fecha">Fecha</vs-th> -->
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].nombre_juego" width="30">
                        <b>{{data[indextr].temas[0].nombreasignatura}}</b> <br>
                        <b>{{ data[indextr].nombre_juego.toUpperCase() }}</b><br>
                        <!-- <b>Descripción:</b> {{ data[indextr].descripcion_juego }}<br> -->
                        <b>Duración:</b> {{ data[indextr].duracion }} min<br>
                        <b>Puntos:</b> {{ data[indextr].puntos }}<br>
                        <b :class="tr.statusJuego === 'Activo' ? 'text-success' : 'text-danger'">
                            {{ tr.statusJuego }}
                        </b>
                    </vs-td>
                    <vs-td height="80px" width="20">
                        <div class="overflow-y-auto h-24">
                            <div :data="item" :key="index" v-for="(item, index) in data[indextr].temas">
                                <div class="mb-2">Unidad {{item.unidad}} <br> {{item.nombre_tema}}</div>
                            </div>
                        </div>
                    </vs-td>
                    <vs-td width="20">
                        <div>
                            <strong>
                                {{ data[indextr].level }}
                                <span v-if="data[indextr].id_group == 1">
                                    - Prolipa
                                </span>
                            </strong>
                        </div>
                        <div style="color:#6c757d;">
                            {{ data[indextr].nombre_usuario }}
                        </div>
                        <div>
                            <b>Creado:</b> {{ data[indextr].fecha_creacion_juego }}
                        </div>
                    </vs-td>
                    <vs-td :data="data[indextr].id" style="width: 150px;">
                        <vx-tooltip style="display: inline-block;" text="Editar juego" position="top" color="success">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="irCrearjuego(data[indextr])" color="success" type="line"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Previsualizar juego" position="top" color="primary">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="previsualizarJuego(data[indextr])" color="primary" type="line"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Eliminar juego" position="top" color="danger">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-trash" @click="juegoElimin=data[indextr].id_juego; openConfirmEliminar();" color="danger" type="line"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Copiar link de juego" position="top" color="warning">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-link" @click="copiarLink(data[indextr]);" color="warning" type="line"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Copiar juego a otra asignatura" position="top" color="primary">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-copy" @click="TransferirJuegos(data[indextr])" color="primary" type="line">
                            </vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- Estado: No hay resultados para el filtro actual, pero sí hay juegos -->
        <div v-else-if="juegos.length > 0 && juegosFiltrados.length === 0" class="text-center py-8">
            <vs-icon icon-pack="feather" icon="icon-search" size="50px" color="rgba(0,0,0,0.2)" class="mb-4"></vs-icon>
            <h4 class="mb-2 text-gray-600">No se encontraron resultados</h4>
            <p class="mb-4 text-gray-500">Prueba a limpiar o cambiar los filtros seleccionados.</p>
            <vs-button color="primary" type="border" @click="limpiarFiltros">Limpiar Filtros</vs-button>
        </div>

        <!-- Estado: No hay absolutamente ningún registro en la base de datos -->
        <div v-else class="text-center py-8">
            <vs-icon icon-pack="feather" icon="icon-inbox" size="50px" color="rgba(0,0,0,0.2)" class="mb-4"></vs-icon>
            <h4 class="mb-4 text-gray-600">Aún no hay juegos creados en esta categoría.</h4>
            <vs-button style="display:inline-block" color="primary" class="mr-2" type="border" @click="$router.go(-1)">Volver al inicio</vs-button>
            <vs-button style="display:inline-block" @click="irCrearjuego('')" color="dark" type="filled">Crear el primer juego</vs-button>
        </div>
        <!------fin listado juegos--------->
    </vx-card>
    <vs-popup fullscreen class="informacionformhijo" @close="getJuegos()" title="Transferencia de Juegos" :active.sync="popupActivoTransferenciaJuegos">
        <TransferenciaJuegos v-if="popupActivoTransferenciaJuegos" :Data_Enviar="Info_Fila_Juego" @change="changeHandleTransferenciaJuegos" />
    </vs-popup>
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
const TransferenciaJuegos = () => import("@/views/juegos/componentes/transferenciaJuegos.vue");
export default {
    data() {
        return {
            juegos: [],
            usuario: [],
            tabActivo: 1,
            id_juego: '',
            id_tipo_juego: '',
            nombre_tipo_juego: '',
            juegoElimin: [],
            activePromptEliminar: false,
            url_juego: '',
            popupActivoTransferenciaJuegos: false,
            Info_Fila_Juego: [],
            // Filtros
            filtro: {
                asignatura: null,
                nivel: null,
                estado: null,
                fecha: null
            },
            configFecha: {
                mode: 'range',
                dateFormat: 'Y-m-d',
                maxDate: new Date(),
                altInput: true,
                altFormat: 'Y-F-d',
                locale: Spanish
            }
        }
    },
    computed: {
        asignaturasUnicas() {
            if (!this.juegos || this.juegos.length === 0) return [];
            const asignaturasSet = new Set();
            this.juegos.forEach(juego => {
                if (juego.temas && juego.temas.length > 0) {
                    juego.temas.forEach(tema => {
                        if (tema.nombreasignatura) {
                            asignaturasSet.add(tema.nombreasignatura);
                        }
                    });
                }
            });
            // Convertir Set a Array y ordenar alfabeticamente
            return Array.from(asignaturasSet).sort();
        },
        nivelesUnicos() {
            if (!this.juegos || this.juegos.length === 0) return [];
            const nivelesSet = new Set();
            this.juegos.forEach(juego => {
                if (juego.level) {
                    nivelesSet.add(juego.level);
                }
            });
            return Array.from(nivelesSet).sort();
        },
        juegosFiltrados() {
            let resultado = this.juegos || [];

            // Filtrar por Estado
            if (this.filtro.estado) {
                resultado = resultado.filter(j => j.statusJuego === this.filtro.estado);
            }

            // Filtrar por Asignatura
            if (this.filtro.asignatura) {
                resultado = resultado.filter(j => {
                    if (!j.temas || j.temas.length === 0) return false;
                    return j.temas.some(tema => tema.nombreasignatura === this.filtro.asignatura);
                });
            }

            // Filtrar por Nivel
            if (this.filtro.nivel) {
                resultado = resultado.filter(j => j.level === this.filtro.nivel);
            }

            // Filtrar por Rango de Fecha de Creación
            if (this.filtro.fecha) {
                // Flatpickr en español usa ' a ', en inglés ' to '. Revisamos ambos casos.
                let separator = this.filtro.fecha.includes(' a ') ? ' a ' : (this.filtro.fecha.includes(' to ') ? ' to ' : null);

                if (separator) {
                    const dates = this.filtro.fecha.split(separator);
                    if (dates.length === 2) {
                        const start = moment(dates[0]).startOf('day');
                        const end = moment(dates[1]).endOf('day');

                        resultado = resultado.filter(j => {
                            if (!j.fecha_creacion_juego) return false;
                            const fechaCreacion = moment(j.fecha_creacion_juego);
                            return fechaCreacion.isBetween(start, end, null, '[]'); // [] significa inclusivo
                        });
                    }
                } else {
                    // Si el usuario solo hizo clic en una fecha y aún no escoge el fin del rango
                    const singleDateStart = moment(this.filtro.fecha).startOf('day');
                    const singleDateEnd = moment(this.filtro.fecha).endOf('day');

                    resultado = resultado.filter(j => {
                        if (!j.fecha_creacion_juego) return false;
                        const fechaCreacion = moment(j.fecha_creacion_juego);
                        return fechaCreacion.isBetween(singleDateStart, singleDateEnd, null, '[]');
                    });
                }
            }

            return resultado;
        }
    },
    components: {
        'v-select': vSelect,
        flatPickr,
        TransferenciaJuegos,
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.id_tipo_juego = localStorage.getItem('id_tipo_juego')
        me.nombre_tipo_juego = localStorage.getItem('nombre_tipo_juego')
    },
    mounted() {
        let me = this
        me.getJuegos()
    },
    methods: {
        getJuegos() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url + 'juegos_prolipa_admin_tipo/' + me.id_tipo_juego)
                .then(res => {
                    me.juegos = res.data.items;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.loading.close()
                })
        },
        limpiarFiltros() {
            this.filtro.asignatura = null;
            this.filtro.nivel = null;
            this.filtro.estado = null;
            this.filtro.fecha = null;
        },
        irCrearjuego(item) {
            let me = this
            localStorage.setItem('data_juego', JSON.stringify(item));
            console.log(item, me.id_tipo_juego)

            switch (me.id_tipo_juego) {
                case '1':
                    me.$router.push('/crear_juego_ponchadoAdmin')
                    break;
                case '2':
                    me.$router.push('/crear_juego_sopaAdmin')
                    break;
                case '3':
                    me.$router.push('/crearJuegoSeleccionSimple')
                    break;
                case '4':
                    me.$router.push('/crearJuegoMillonario')
                    break;
                case '5':
                    me.$router.push('/crearJuegoMemoriaAdmin')
                    break;
                case '6':
                    me.$router.push('/crearJuegoRompecabezas')
                    break;
                default:
                    break;
            }
        },
        openConfirmEliminar() {
            let me = this;
            me.activePromptEliminar = true;
        },
        eliminarJuego() {
            let me = this;
            this.$http.get(this.$server_url + `j_juegos_eliminar/${me.juegoElimin}`).then(res => {
                    me.getJuegos()
                    me.$vs.notify({
                        text: 'Juego eliminado',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(function (error) {

                })
        },
        copiarLink(item) {
            let me = this
            let date = new Date()
            // let fecha_actual = moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')

            // if( fecha_actual < item.fecha_inicio || fecha_actual > item.fecha_fin ){
            //     me.$vs.notify({
            //     text:'Este juego aún no está disponible. Verifique las fechas de inicio y fin.',
            //     color:'warning',
            //     iconPack: 'feather',
            //     icon:'icon-alert-triangle'})
            //     return
            // }

            switch (me.id_tipo_juego) {
                case '1':
                    me.url_juego = 'ponchado'
                    break;
                case '2':
                    me.url_juego = 'sopa_letras'
                    break;
                case '3':
                    me.url_juego = 'jugarSeleccionSimple'
                    break;
                case '4':
                    me.url_juego = 'jugarMillonario'
                    break;
                case '6':
                    me.url_juego = 'rompecabezas'
                    break;
                default:
                    break;
            }

            let link = window.location.host + '/' + me.url_juego + '/' + item.id_juego + '/previsualizar'
            var aux = document.createElement("input");
            aux.setAttribute("value", link);
            document.body.appendChild(aux);
            aux.select();

            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({
                        text: 'Error al copiar el link',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                } else {
                    me.$vs.notify({
                        text: 'Link copiado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }

            document.body.removeChild(aux);
        },
        previsualizarJuego(item) {
            let url_juego = ''
            let id_tipo = parseInt(item.id_tipo_juego)
            console.log(item)
            // return
            switch (id_tipo) {
                case 1:
                    url_juego = 'ponchado'
                    break;
                case 2:
                    url_juego = 'sopa_letras'
                    break;
                case 3:
                    url_juego = 'jugarSeleccionSimple'
                    break;
                case 4:
                    url_juego = 'jugarMillonario'
                    break;
                case 6:
                    url_juego = 'rompecabezas'
                    break;
                default:
                    break;
            }

            window.open('/' + url_juego + '/' + item.id_juego + '/previsualizar', "_blank");
        },
        TransferirJuegos(item) {
            let me = this;
            // console.log(item, "hola que hace ");
            me.popupActivoTransferenciaJuegos = true;
            me.Info_Fila_Juego = item;
        },
        changeHandleTransferenciaJuegos(e) {
            let me = this;
            if (e.verificacionemittransferenciaJuegos == 1) {
                me.popupActivoTransferenciaJuegos = false;
                me.getJuegos();
            } else if (e.verificacionemittransferenciaJuegos == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoTransferenciaJuegos = false;
            } else {
                console.log("Emit no recibido");
            }
        },
    },
}
</script>

<style>
.btnwizard {
    width: 65px;
    height: 65px;
    font-size: 22px;
    padding: 0px;
    border-radius: 100%;
    border: 2px solid rgb(29, 90, 182);
    background-color: white;
    color: rgb(29, 90, 182);
    cursor: pointer;
}
</style>
