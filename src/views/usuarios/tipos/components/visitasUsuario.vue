<template>
    <div>
        <!-- Cabecera: botón regresar + título -->
        <div class="flex items-center flex-wrap gap-2">
            <vs-button color="primary" size="small" @click="regresar()" icon="reply" type="border"></vs-button>
            <vs-chip color="primary" class="ml-2">{{tipoDescripcion}}</vs-chip>
        </div>

        <vs-divider class="mt-3"></vs-divider>

        <!-- Info del usuario -->
        <div class="usuario-info mb-3">
            <p><b>Nombre:</b> {{datoU.nombres}} {{datoU.apellidos}}</p>
            <p><b>Institución:</b> {{datoU.nombreInstitucion}}</p>
            <p><b>Email:</b> {{datoU.email}}</p>
            <p><b>Cédula:</b> {{datoU.cedula}}</p>
        </div>

        <!-- Filtros FUERA de la tabla para control total del layout -->
        <div class="filtros-wrapper">
            <div class="filtros-row">
                <div class="filtro-item">
                    <flat-pickr
                        :config="configdateTimePicker"
                        v-model="fromDate"
                        placeholder="Fecha Inicio"
                        class="flatpickr-input"
                    />
                </div>
                <div class="filtro-item">
                    <flat-pickr
                        :config="configdateTimePicker"
                        v-model="toDate"
                        placeholder="Fecha Fin"
                        class="flatpickr-input"
                    />
                </div>
                <div class="filtro-actions">
                    <vs-button radius @click="getVisitas()" color="success" type="gradient" icon="search"></vs-button>
                    <vs-dropdown vs-custom-content vs-trigger-click class="ml-2">
                        <vs-button type="relief" class="a-icon">
                            Filtro
                            <vs-icon icon="expand_more"></vs-icon>
                        </vs-button>
                        <vs-dropdown-menu class="loginx">
                            <vs-dropdown-item style="width:200px" @click="setTipo(15,'Visitas de ingreso al sistema')">
                                <span class="feather icon icon-crop"></span> Ingreso al sistema
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(1,'Libros')">
                                <span class="feather icon icon-edit"></span> Libros
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(2,'Unidades')">
                                <span class="feather icon icon-gift"></span> Unidades
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(3,'Cuadernos')">
                                <span class="feather icon icon-users"></span> Cuaderno
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(4,'Teletareas')">
                                <span class="feather icon icon-user"></span> Teletarea
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(5,'Proyectos')">
                                <span class="feather icon icon-filter"></span> Proyectos
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(6,'Adaptaciones')">
                                <span class="feather icon icon-arrow-left-circle"></span> Adaptaciones
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(7,'Propuestas')">
                                <span class="feather icon icon-arrow-left-circle"></span> Propuestas
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(8,'Juegos')">
                                <span class="feather icon icon-arrow-left-circle"></span> Juegos
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(9,'Material')">
                                <span class="feather icon icon-arrow-left-circle"></span> Material
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(10,'Articulos')">
                                <span class="feather icon icon-arrow-left-circle"></span> Articulos
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(11,'Tareas')">
                                <span class="feather icon icon-arrow-left-circle"></span> Tareas
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(12,'Pdf guia')">
                                <span class="feather icon icon-arrow-left-circle"></span> Pdf guia
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(13,'Pdf sin guia')">
                                <span class="feather icon icon-arrow-left-circle"></span> Pdf sin guia
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(14,'Guias didacticas')">
                                <span class="feather icon icon-arrow-left-circle"></span> Guia didactica
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(17,'Documentos minesteriales')">
                                <span class="feather icon icon-arrow-left-circle"></span> Documento minesterial
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(18,'Videos')">
                                <span class="feather icon icon-arrow-left-circle"></span> Videos
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(19,'Actividades')">
                                <span class="feather icon icon-arrow-left-circle"></span> Actividades
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="setTipo(20,'Animaciones')">
                                <span class="feather icon icon-arrow-left-circle"></span> Animaciones
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </div>
            </div>
            <p class="cantidad-label">Cantidad: <span class="font-bold">{{listaVisitas.length}}</span></p>
        </div>

        <!-- Tabla con scroll horizontal en móvil -->
        <div class="tabla-responsive-wrapper">
            <vs-table max-items="30" search pagination :data="listaVisitas">
                <template slot="thead">
                    <vs-th v-if="tipo!=15" sort-key="nombreasignatura">Información</vs-th>
                    <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                    <vs-th sort-key="periodo">Periodo</vs-th>
                    <vs-th sort-key="recurso">Tipo</vs-th>
                    <vs-th sort-key="created_at">Fecha</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td v-if="tipo!=15">
                            <span class="td-label">Asignatura:</span>
                            <span class="font-semibold">{{ tr.nombreasignatura }}</span>
                        </vs-td>
                        <vs-td>
                            <span class="td-label">Institución:</span>
                            {{ tr.nombreInstitucion }}
                        </vs-td>
                        <vs-td>
                            <span class="td-label">Periodo:</span>
                            {{ tr.periodo }}
                        </vs-td>
                        <vs-td>
                            <vs-chip color="primary" style="white-space:nowrap">{{ tipoDescripcion }}</vs-chip>
                        </vs-td>
                        <vs-td>
                            <span class="td-label">Fecha:</span>
                            {{ tr.created_at }}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
</template>
<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import moment from 'moment'
import 'flatpickr/dist/flatpickr.css';
export default{
    props:{
        datoU:{
            type:Object,
            default:()=>{},
        }
    },
    components:{
        flatPickr,
        vSelect
    },  
    data(){
        return{
            usuario:[],
            listaVisitas:[],
            fromDate:null,
            toDate:null,
            tipo:15,
            tipoDescripcion:'Visitas de ingreso al sistema',
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
        }
    },
    created(){
        let me = this;
        me.usuario  = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        const date = new Date()
        const primerDia = new Date(date.getFullYear(), date.getMonth(), 1)
        const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        me.fromDate = primerDia
        me.toDate = ultimoDia
        me.getVisitas()
    },
    methods:{
        regresar(){
            this.$emit('escuchar',0)
        },
        setTipo(id, descripcion) {
            this.tipo = id
            this.tipoDescripcion = descripcion
            this.getVisitas()
        },
        getVisitas(){
            let me = this;
            me.listaVisitas = [];
            const from = moment(me.fromDate).format('YYYY-MM-DD')
            const to = moment(me.toDate).format('YYYY-MM-DD')
               if (me.fromDate == null) {
                me.$vs.notify({
                text: 'Debe escoger una fecha inicio',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-check'
                })
                return false
            }
            if (me.toDate == null) {
                me.$vs.notify({
                text: 'Debe escoger una fecha final',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-check'
                })
                return false
            }
            if (me.fromDate > me.toDate) {
                me.$vs.notify({
                text: 'La fecha inicio no puede mayor que la fecha final',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-check'
                })
                return false
            }
            this.$http.get(this.$server_url+'usuarioVisitas?idusuario='+me.datoU.idusuario+'&fromDate='+from+'&toDate='+to)
                .then(function (res) {
                    let datos = res.data 
                    me.listaVisitas = datos.filter(p => p.recurso == me.tipo);
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getHistorico(){
        let me = this
        this.$http.get(this.$server_url+`historicoActividades?tipo=`+me.tipo).then(res => {
            me.arregloHistorico = res.data;
            me.tmparregloHistorico  = res.data
            })
            .catch(function (error) {
            console.log(error)
            })
        },
    },
}
</script>

<style scoped>
/* ── Contenedor raíz ocupa todo el ancho ── */
div {
    width: 100%;
    box-sizing: border-box;
}

/* ── Info del usuario ── */
.usuario-info p {
    margin: 2px 0;
    font-size: 14px;
}

/* ── Bloque de filtros: full width, se apila en móvil ── */
.filtros-wrapper {
    width: 100%;
    margin-bottom: 12px;
    box-sizing: border-box;
}

.filtros-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    width: 100%;
}

/* Cada date picker ocupa espacio equitativo y nunca menos de 130px */
.filtro-item {
    flex: 1 1 130px;
    min-width: 130px;
    box-sizing: border-box;
}

/* El input de flatpickr cubre todo su contenedor */
.filtro-item :deep(.flatpickr-input) {
    width: 100% !important;
    box-sizing: border-box;
    border: 1px solid #d0d0d0;
    border-radius: 6px;
    padding: 7px 10px;
    font-size: 13px;
    line-height: 1.4;
}

.filtro-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}

.cantidad-label {
    margin-top: 8px;
    font-size: 13px;
    color: #555;
}

/* ── Wrapper tabla: ocupa todo el ancho, scroll horizontal si es necesario ── */
.tabla-responsive-wrapper {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
}

/* Fuerza la tabla interna a ocupar 100% */
.tabla-responsive-wrapper :deep(.vs-table--content) {
    width: 100% !important;
}

.tabla-responsive-wrapper :deep(table) {
    width: 100% !important;
    table-layout: auto;
}

/* Etiqueta de campo — visible solo en móvil */
.td-label {
    display: none;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    color: #888;
    margin-right: 6px;
    white-space: nowrap;
}

/* ── Móvil: cards en lugar de filas de tabla ── */
@media (max-width: 640px) {
    /* Ocultar thead */
    .tabla-responsive-wrapper :deep(thead) {
        display: none !important;
    }

    /* Cada tr = card */
    .tabla-responsive-wrapper :deep(tbody tr.tr-values) {
        display: block !important;
        width: 100% !important;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 10px 14px;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        box-sizing: border-box;
    }

    /* Cada td ocupa fila completa */
    .tabla-responsive-wrapper :deep(tbody td.td-check),
    .tabla-responsive-wrapper :deep(tbody td) {
        display: flex !important;
        align-items: flex-start;
        padding: 5px 0 !important;
        font-size: 13px;
        border: none !important;
        width: 100% !important;
        box-sizing: border-box;
    }

    .td-label {
        display: inline !important;
    }
}
</style>
