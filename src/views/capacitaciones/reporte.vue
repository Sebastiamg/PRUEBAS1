<script>
import vSelect from 'vue-select';
import ListTile from './components/ListTileComponent.vue';
import CapacitacionFormModal from '../certificados/components/CapacitacionFormModal.vue';
import CertificadosAsignarEncuesta from '../certificados/components/CertificadosAsignarEncuesta.vue';
import moment from 'moment';
import * as XLSX from 'xlsx';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default ({
    components: {
        vSelect,
        ListTile,
        CapacitacionFormModal,
        CertificadosAsignarEncuesta,
        flatPickr,
    },
    data: () => ({
        title: 'Reporte de capacitaciones',
        periodo: null,
        prevPeriodo: '',
        periodos: [
            'todo',
        ],
        tiempo: 'todo',
        tiempos: [
            'todo',
            'hoy',
            'ésta semana',
            'éste mes',
            'por fechas'
        ],
        capacitador: 'todos',
        capacitadores: [],
        tipo: {
            id: null,
            label: 'todo',
        },
        tipos: [{
                id: null,
                label: 'todo',
            },
            {
                id: 0,
                label: 'Presencial',
            },
            {
                id: 1,
                label: 'Virtual',
            },
        ],
        capacitaciones: [],
        filtro_fecha_ini: '',
        filtro_fecha_fin: '',
        currentUser: null,
        search: '',
        isOpen: false,
        capacitacion: {},
        periodoSelect: null,
        tableData: [],
        dataExport: [],
        meses: [{
                nombre: 'Enero',
                numero: 1
            },
            {
                nombre: 'Febrero',
                numero: 2
            },
            {
                nombre: 'Marzo',
                numero: 3
            },
            {
                nombre: 'Abril',
                numero: 4
            },
            {
                nombre: 'Mayo',
                numero: 5
            },
            {
                nombre: 'Junio',
                numero: 6
            },
            {
                nombre: 'Julio',
                numero: 7
            },
            {
                nombre: 'Agosto',
                numero: 8
            },
            {
                nombre: 'Septiembre',
                numero: 9
            },
            {
                nombre: 'Octubre',
                numero: 10
            },
            {
                nombre: 'Noviembre',
                numero: 11
            },
            {
                nombre: 'Diciembre',
                numero: 12
            }
        ],
        arraryStatus: [{
                nombre: 'Pendiente',
                estado: 1
            },
            {
                nombre: 'Realizada',
                estado: 2
            },
            {
                nombre: 'Cancelada',
                estado: 0
            },
            {
                nombre: 'No realizada',
                estado: 3
            },
        ],
        mesSelect: '',
        estadoSelect: 1,
        dateRange: "",
        config: {
            mode: 'range',
            dateFormat: 'Y-m-d',
            locale: {
                firstDayOfWeek: 1, // Para comenzar la semana en lunes
            },
        },
        configdateTimePicker: {
            enableTime: true,
            dateFormat: 'Y-m-d'
        },
        fromDate: null,
        toDate: null,
        // encuestas de capacitación
        modalEncuestas: false,
        capacitacionEncuesta: null,
    }),
    computed: {
        startDate() {
            if (typeof this.dateRange === 'string' && this.dateRange.includes(' to ')) {
                return this.dateRange.split(' to ')[0];
            }
            return '';
        },
        endDate() {
            if (typeof this.dateRange === 'string' && this.dateRange.includes(' to ')) {
                return this.dateRange.split(' to ')[1];
            }
            return '';
        },
        filteredKeys() {
            if (!this.tableData.length) return [];
            const excludedKeys = [
                'id',
                'estado_capacitacion',
                'fecha_creación',
                'fecha_inicio',
                'tipo',
                'periodo',
                'institucion',
                'ciudad',
                'asesor',
                'modalidad',
                'programa',
                'n_asistentes',
                'fecha',
                'horario',
                'editor_nombre', // Campo excluido
                'updated_at', // Campo excluido
                'no_realizada' // Campo excluido (se muestra como chip)
            ];
            const keys = Object.keys(this.tableData[0]);
            return keys.filter(key => !excludedKeys.includes(key));
        }
    },
    created() {
        // this.getPeriodos();
        this.periodo = this.periodos[0];
        this.getCapacitadores();
        this.prevPeriodo = this.periodos[0];
        this.tipo = this.tipos[0];
        this.currentUser = JSON.parse(localStorage.getItem('usuario'));
        this.periodoSelect = JSON.parse(localStorage.getItem('periodo'));
        this.getStart()
    },
    methods: {
        // getPeriodos() {
        //   const me = this;
        //   me.$http.get(`${me.$server_url}get_periodos_seminarios`)
        //     .then((res) => {
        //       me.periodos = res.data.filter(p => p.idperiodoescolar != 20 && p.idperiodoescolar != 17 && p.idperiodoescolar != 15 && p.idperiodoescolar != 14 && p.idperiodoescolar > 11 && p.estado == 1)
        //       me.periodo = me.periodos[0];
        //       me.getCapacitaciones()
        //     })
        //     .catch((err) => this.showError("Error al obtener los periodos"));
        // },
        getCapacitadores() {
            const me = this;
            me.$http.get(`${me.$server_url}getCapacitadores`)
                .then((res) => {
                    me.capacitadores = res.data;
                })
                .catch((err) => this.showError("Error al obtener los capacitadores"));
        },
        getStart() {
            const me = this;
            me.tableData = []
            me.dataExport = []
            // Inicializa 'capacitaciones' como un array vacío
            me.capacitaciones = [];
            //si estadoSelect es 2 de finalizado o 0 de cancelado no debe tener las fechas startDate y endDate diferente de nulo vacio o undefined
            if (this.estadoSelect == 2 || this.estadoSelect == 0) {
                if (this.fromDate == '' || this.toDate == '') {
                    this.dateRange = ""
                    this.showError('Debe seleccionar un rango de fechas');
                    return
                }
            }
            me.$vs.loading();
            // Realiza una petición GET al servidor para obtener las capacitaciones
            me.$http.get(`${me.$server_url}reporte/capacitaciones?estadoCapacitacion=${me.estadoSelect}&fecha_from=${me.startDate}&fecha_to=${me.endDate}&idusuario=${me.currentUser.idusuario}`)
                .then((res) => {
                    // Añade los datos de respuesta al array 'capacitaciones'
                    // me.capacitaciones.push(...res.data);
                    me.capacitaciones = res.data
                    
                    if (me.capacitaciones.length == 0) {
                        this.showWarning('No se encontraron capacitaciones');
                        return
                    }
                    
                    me.capacitaciones = me.capacitaciones.map((cap) => {
                        // Utiliza una nueva propiedad para almacenar el número del mes
                        cap.formatMes = moment(cap.fecha_inicio).format('M');
                        return cap;
                    });
                    // Almacena las capacitaciones en el almacenamiento local del navegador
                    localStorage.setItem('capacitaciones', JSON.stringify(me.capacitaciones));
                    // Llama a la función 'queryData'
                    this.queryData();
                }).catch((err) => {
                    // Muestra un mensaje de error
                    this.showError(`Error: ${err}`)
                })
                .finally(() => me.$vs.loading.close());
        },
        getCapacitaciones() {
            const me = this;
            me.mesSelect = ''
            me.tableData = []
            me.dataExport = []
            // Inicializa 'capacitaciones' como un array vacío
            me.capacitaciones = [];
            //si estadoSelect es 2 de finalizado o 0 de cancelado no debe tener las fechas startDate y endDate diferente de nulo vacio o undefined
            if (this.estadoSelect == 2 || this.estadoSelect == 0) {
                if (this.fromDate == null || this.fromDate == "" || this.fromDate == undefined) {
                    this.showError('Debe seleccionar una fecha desde');
                    return
                }
                if (this.toDate == null || this.toDate == "" || this.toDate == undefined) {
                    this.showError('Debe seleccionar una fecha hasta');
                    return
                }
                //si la fecha toDate es mayor a la fecha fromDate
                if (this.fromDate > this.toDate) {
                    this.showError('La fecha desde no puede ser mayor a la fecha hasta');
                    return
                }
            }
            // me.$vs.loading();
            // Realiza una petición GET al servidor para obtener las capacitaciones
            me.$http.get(`${me.$server_url}reporte/capacitaciones?estadoCapacitacion=${me.estadoSelect}&fecha_from=${me.fromDate}&fecha_to=${me.toDate}&idusuario=${me.currentUser.idusuario}`)
                .then((res) => {
                    // Añade los datos de respuesta al array 'capacitaciones'
                    // me.capacitaciones.push(...res.data);
                    me.capacitaciones = res.data;
                    // console.log('me.capacitaciones',me.capacitaciones)
                    if (me.capacitaciones.length == 0) {
                        this.showWarning('No se encontraron capacitaciones');
                        return
                    }
                    me.capacitaciones = me.capacitaciones.map((cap) => {
                        // Utiliza una nueva propiedad para almacenar el número del mes
                        cap.formatMes = moment(cap.fecha_inicio).format('M');
                        return cap;
                    });
                    // Almacena las capacitaciones en el almacenamiento local del navegador
                    localStorage.setItem('capacitaciones', JSON.stringify(me.capacitaciones));
                    // Llama a la función 'queryData'
                    this.queryData();
                }).catch((err) => {
                    // Muestra un mensaje de error
                    this.showError(`Error: ${err}`)
                })
                .finally(() => me.$vs.loading.close());
        },
        queryData() {
            let me = this
            // let _capacitaciones = JSON.parse(localStorage.getItem('capacitaciones'));
            let _capacitaciones = me.capacitaciones
            //si el mes esta seleccionado filtro
            if (this.mesSelect) {
                _capacitaciones = _capacitaciones.filter(c => c.formatMes == this.mesSelect);
                this.buildDataTable(_capacitaciones);
                return
            } else {
                this.buildDataTable(_capacitaciones);
            }
            // //mes - periodo - estado
            // if(this.mesSelect && this.estadoSelect){
            //   _capacitaciones = _capacitaciones.filter(c => (c.periodo_id == this.periodo.idperiodoescolar) && (c.formatMes == this.mesSelect) && (c.estado_capacitacion == this.estadoSelect));
            //   this.buildDataTable(_capacitaciones);
            //   return
            // }
            // //periodo - estado
            // if(this.periodo && this.estadoSelect){
            //   _capacitaciones = _capacitaciones.filter(c => (c.periodo_id == this.periodo.idperiodoescolar) && (c.estado_capacitacion == this.estadoSelect));
            //   this.buildDataTable(_capacitaciones);
            //   return
            // }
            // if(this.mesSelect && this.periodo){
            //   _capacitaciones = _capacitaciones.filter(c => (c.periodo_id == this.periodo.idperiodoescolar) && (c.formatMes == this.mesSelect) );
            //   this.buildDataTable(_capacitaciones);
            //   return
            // }
            // if (this.periodo) {
            //   _capacitaciones = _capacitaciones.filter(c => c.periodo_id == this.periodo.idperiodoescolar);
            //   this.buildDataTable(_capacitaciones);
            //   return
            // }
        },
        exportData() {
            let me = this
            const ws = XLSX.utils.json_to_sheet(this.dataExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Capacitaciones');
            XLSX.writeFile(wb, 'capacitaciones.xlsx');
        },
        showError(msg) {
            this.$vs.notify({
                title: 'Error',
                text: msg,
                color: 'danger',
            });
        },
        showWarning(msg) {
            this.$vs.notify({
                title: 'Advertencia',
                text: msg,
                color: 'warning',
            });
        },
        setVal(param, val) {
            this[param] = val;
            this.queryData();
        },
        editCapacitacion(capId) {
            const cap = this.capacitaciones.find(c => c.id_seminario == capId)
            if (!cap) return

            this.capacitacion = { ...cap }
            if (!this.capacitacion.nombreInstitucion) {
                this.capacitacion.nombreInstitucion = cap.institucion || cap.nombre_institucion_temporal || ''
            }
            this.periodoSelect = this.periodo || this.periodoSelect
            this.isOpen = true
        },
        rechargeCapacitacionEdit() {
            this.getCapacitaciones()
            this.isOpen = false
        },
        buildDataTable(_capacitaciones) {
            // Inicializa la tabla de datos como un array vacío
            this.tableData = [];
            this.dataExport = []
            // Inicializa un array vacío para almacenar los datos de las capacitaciones
            const data = [];
            const data2 = [];
            // Itera sobre cada capacitación en el conjunto de capacitaciones
            _capacitaciones.forEach((cap) => {
                // Crea un objeto para almacenar los datos de la capacitación
                let capacitacion = {
                    'id': cap.id_seminario,
                    'periodo': cap.cicloEscolar,
                    // 'institucion': cap.institucion ? cap.institucion.nombreInstitucion : cap.nombre_institucion_temporal,
                    'institucion': cap.nombreInstitucion,
                    // 'ciudad': cap.institucion ? cap.institucion.ciudad.nombre : '-',
                    // 'asesor': `${cap.asesor.nombres} ${cap.asesor.apellidos}`,
                    'asesor': cap.asesor,
                    'modalidad': cap.tipo == 0 ? 'Presencial' : 'Virtual',
                    'programa': cap.nombre,
                    'n_asistentes': cap.cant_asistentes === null ? '-' : cap.cant_asistentes,
                    'cant_encuestas': cap.cant_encuestas || 0,
                    'estado_capacitacion': cap.estado_capacitacion,
                    'fecha': moment(cap.fecha_inicio).format('ddd DD [de] MMM, YYYY'),
                    'fecha_creación': cap.created_at,
                    'fecha_inicio': cap.fecha_inicio,
                    'horario': `${cap.hora_inicio} - ${cap.hora_fin} (${this.getDuration(cap.hora_inicio, cap.hora_fin)} horas)`,
                    'tipo': cap.tipo,
                    'editor_nombre': cap.editor_nombre,
                    'updated_at': cap.updated_at,
                    'no_realizada': this.esNoRealizada(cap),
                };
                // Itera sobre cada capacitador en la lista de capacitadores
                this.capacitadores.forEach((capacitador) => {
                    // Inicializa un array vacío para almacenar los capacitadores de la capacitación
                    let _capacitadores = [];

                    // Si la capacitación tiene capacitadores, los divide en un array
                    if (cap.capacitador != null && cap.capacitador != '') {
                        _capacitadores = cap.capacitador.split(',');
                    }

                    // Añade una propiedad al objeto de la capacitación para cada capacitador
                    // Si el capacitador está en la lista de capacitadores de la capacitación, asigna 'Asignado'
                    // Si no, asigna 'Libre'
                    capacitacion[capacitador.capacitador] = _capacitadores.includes(capacitador.capacitador.toString()) ? 'Asignado' : 'Libre';
                });

                // Añade el objeto de la capacitación al array de datos
                data.push(capacitacion)
            });
            //==================exportar=====================
            _capacitaciones.forEach((cap) => {
                // Crea un objeto para almacenar los datos de la capacitación
                // 0 = cancelado; 1 = activo ; 2 = finalizado estado_capacitacion
                let capacitacion2 = {
                    'id': cap.id_seminario,
                    'periodo': cap.cicloEscolar,
                    'institucion': cap.nombreInstitucion,
                    'asesor': cap.asesor,
                    'programa': cap.nombre,
                    'n_asistentes': cap.cant_asistentes === null ? '-' : cap.cant_asistentes,
                    // 'estado_capacitacion':cap.estado_capacitacion,
                    'estado_capacitacion': cap.estado_capacitacion == 0 ? 'Cancelada' : cap.estado_capacitacion == 1 ? (this.esNoRealizada(cap) ? 'No realizada' : 'Pendiente') : 'Realizada',
                    'dias_atraso': this.esNoRealizada(cap) ? moment().startOf('day').diff(moment(cap.fecha_inicio).startOf('day'), 'days') : '',
                    'fecha_creación': cap.created_at,
                    'fecha_inicio': cap.fecha_inicio,
                    'horario': `${cap.hora_inicio} - ${cap.hora_fin} (${this.getDuration(cap.hora_inicio, cap.hora_fin)} horas)`,
                    'area_capacitacion': cap.area_capacitacion || '',
                    'oferta_academica': cap.nombreofertaAcademica || '',
                    'tipo_capacitacion': cap.tipo == 0 ? 'Presencial' : 'Virtual',

                };
                // Itera sobre cada capacitador en la lista de capacitadores
                this.capacitadores.forEach((capacitador) => {
                    // Inicializa un array vacío para almacenar los capacitadores de la capacitación
                    let _capacitadores = [];

                    // Si la capacitación tiene capacitadores, los divide en un array
                    if (cap.capacitador != null && cap.capacitador != '') {
                        _capacitadores = cap.capacitador.split(',');
                    }

                    // Añade una propiedad al objeto de la capacitación para cada capacitador
                    // Si el capacitador está en la lista de capacitadores de la capacitación, asigna 'Asignado'
                    // Si no, asigna 'Libre'
                    capacitacion2[capacitador.capacitador] = _capacitadores.includes(capacitador.capacitador.toString()) ? 'Asignado' : '';
                });

                // Añade el objeto de la capacitación al array de datos
                data2.push(capacitacion2)
            });
            this.dataExport.push(...data2)
            // Añade todos los elementos del array de datos a la tabla de datos
            this.tableData.push(...data);
        },
        // Una capacitación se considera "no realizada" cuando quedó en estado
        // pendiente (1) y su fecha de capacitación ya pasó.
        esNoRealizada(cap) {
            return cap.estado_capacitacion == 1 && moment(cap.fecha_inicio).startOf('day').isBefore(moment().startOf('day'));
        },
        getDuration(horaInicio, horaFin) {
            const inicio = moment(horaInicio, 'HH:mm:ss');
            const fin = moment(horaFin, 'HH:mm:ss');
            const duration = moment.duration(fin.diff(inicio));
            return duration.asHours().toFixed(2);
        },
        // ─── ENCUESTAS DE CAPACITACIÓN ───────────────────────────────────────────────
        abrirEncuestas(capacitacion) {
            // Buscar la capacitación completa en el array original para obtener todos los datos
            const capCompleta = this.capacitaciones.find(c => c.id_seminario == capacitacion.id);
            if (capCompleta) {
                this.capacitacionEncuesta = capCompleta;
                this.modalEncuestas = true;
            } else {
                this.showError('No se pudo cargar la información de la capacitación');
            }
        },
        recargarDespuesEncuestas() {
            const me = this;
            // Recarga los datos sin validaciones adicionales
            me.$http.get(`${me.$server_url}reporte/capacitaciones?estadoCapacitacion=${me.estadoSelect}&fecha_from=${me.fromDate}&fecha_to=${me.toDate}&idusuario=${me.currentUser.idusuario}`)
                .then((res) => {
                    me.capacitaciones = res.data;
                    
                    if (me.capacitaciones.length == 0) {
                        this.showWarning('No se encontraron capacitaciones');
                        return
                    }
                    
                    me.capacitaciones = me.capacitaciones.map((cap) => {
                        cap.formatMes = moment(cap.fecha_inicio).format('M');
                        return cap;
                    });
                    localStorage.setItem('capacitaciones', JSON.stringify(me.capacitaciones));
                    this.queryData();
                }).catch((err) => {
                    console.error('Error al recargar capacitaciones:', err);
                });
        },
    },
    watch: {
        // Esta función se llama cuando el valor de 'periodo' cambia
        periodo(val) {
            this.prevPeriodo = val;
            // Llama a la función 'queryData' para obtener nuevos datos basados en el nuevo periodo
            this.queryData();
            // Comprueba si el nuevo valor es diferente del valor anterior
            // if (val !== this.prevPeriodo) {
            //   // Si es diferente, actualiza el valor anterior con el nuevo valor
            //   this.prevPeriodo = val;
            //   // Llama a la función 'queryData' para obtener nuevos datos basados en el nuevo periodo
            //   this.queryData();
            // }
            // Si el nuevo valor es igual al valor anterior, no hace nada
        },
        mesSelect() {
            this.queryData();
        },
        // estadoSelect(){
        //   this.queryData();
        // }
        // Al cerrar el modal de encuestas, recarga la lista para actualizar el chip
        modalEncuestas(val) {
            if (!val) {
                this.recargarDespuesEncuestas();
            }
        }
    }
})
</script>

<style>
.fixed-column {
    position: sticky;
    left: 0;
    background-color: white;
}
</style>

<template>
<div class="w-full flex flex-col space-y-2">
    <div class="vx-row">
        <div class="vx-col w-full sm:w-full md:w-full lg:w-3/5 xl:w-1/3">
            <span class="">Estado</span>
            <ul class="flex mt-2 items-center">
                <li>
                    <vs-radio v-model="estadoSelect" @input="getCapacitaciones();" class="mr-2" vs-name="radios1estadoSelect" vs-value="1">Pendientes</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="estadoSelect" @input="getCapacitaciones();" class="mr-2" vs-name="radios1estadoSelect" vs-value="2">Realizada</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="estadoSelect" @input="getCapacitaciones();" class="mr-2" vs-name="radios1estadoSelect" vs-value="0">Cancelada</vs-radio>
                </li>
                <li v-if="currentUser && (currentUser.id_group == 1 || currentUser.id_group == 5)">
                    <vx-tooltip text="Capacitaciones pendientes cuya fecha ya pasó" position="top" color="danger">
                        <vs-radio v-model="estadoSelect" @input="getCapacitaciones();" class="mr-2" vs-name="radios1estadoSelect" vs-value="3">No realizadas</vs-radio>
                    </vx-tooltip>
                </li>
                <li class="ml-2">
                    <vs-button @click="getCapacitaciones();" color="primary" type="filled" icon="refresh" size="small">
                        Actualizar
                    </vs-button>
                </li>
            </ul>
        </div>
        <div class="vx-col w-full sm:w-full md:w-full lg:w-2/5 xl:w-1/3">
            <span>Fecha creación desde:</span>
            <flat-pickr :config="configdateTimePicker" v-model="fromDate" placeholder="Fecha desde" class="m-1" style="display: inline-block;width: 100%;" />
        </div>
        <div class="vx-col w-full sm:w-full md:w-full lg:w-2/5 xl:w-1/3">
            <small>Fecha creación Hasta:</small>
            <div class="flex">
                <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Hasta" class="w-full" />
                <vx-tooltip style="display: inline-block;" text="Buscar" position="top" color="primary">
                    <vs-button icon="search" v-if="fromDate && toDate" @click="getCapacitaciones();" class="ml-1"></vs-button>
                </vx-tooltip>
                <vx-tooltip style="display: inline-block;" text="Mostrar todo" position="top" color="primary">
                    <vs-button icon-pack="feather" color="warning" icon="icon-x" v-if="fromDate && toDate" @click="fromDate='';toDate='';getCapacitaciones();" class="ml-2"></vs-button>
                </vx-tooltip>
            </div>
        </div>
    </div>
    <br>
    <vs-divider class="mt-2">Filtrar por:</vs-divider>
    <!--Filtrar por meses-->
    <div class="vx-row">
        <div class="vx-col w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3">
            <span>Meses</span>
            <v-select :options="meses" :reduce="meses => meses.numero" label="nombre" class="w-full" v-model="mesSelect" />
        </div>
    </div>
    <br>
    <vs-button @click="exportData" color="primary" class="btn btn-sm mt-5">
        Exportar
    </vs-button>
    <vs-table max-items="10" search stripe pagination :data="tableData">
        <template slot="header">
            <vs-chip>Cantidad {{tableData.length}}</vs-chip>
        </template>
        <template slot="thead">
            <vs-th></vs-th>
            <vs-th class="fixed-column">Capacitación</vs-th>
            <vs-th class="fixed-column" sort-key="fecha_inicio">Programa</vs-th>
            <!-- <vs-th v-for="(value, key) in tableData[0]" :key="key"
          v-if="key !== 'id' && key !== 'estado_capacitacion' && key !== 'fecha_creación' && key !== 'fecha_inicio' && key !== 'tipo' && key !== 'periodo' && key !== 'institucion' && key !== 'ciudad' && key !== 'asesor' && key !== 'modalidad' && key !== 'programa' && key !== 'n_asistentes' && key !== 'fecha' && key !== 'horario'">
          {{ key.toUpperCase().replace('_', ' ') }}
        </vs-th> -->
            <vs-th v-for="key in filteredKeys" :key="key">
                {{ key.toUpperCase().replace('_', ' ') }}
            </vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    <vs-button @click="editCapacitacion(tr.id)" v-if="currentUser.id_group == 1 || currentUser.id_group == 5" color="dark" type="line" icon="edit" size="small">
                        Editar
                    </vs-button>
                    <vx-tooltip v-if="currentUser.id_group == 1 || currentUser.id_group == 5" style="display: inline-block;" text="Encuestas" position="top" color="warning">
                        <vs-button size="small" class="ml-1" icon-pack="feather" icon="icon-clipboard"
                            @click="abrirEncuestas(tr)" color="warning" type="line">
                        Encuestas</vs-button>
                    </vx-tooltip>
                </vs-td>
                <vs-td class="fixed-column">
                    <div>
                        <div style="width: 200px;" class="flex flex-col gap-2">
                            <span v-if="currentUser.name_usuario == 'sguacan'"> # {{ tr.id }}</span>
                            <span class="flex font-bold">{{ tr.institucion }}</span>
                            <span class="text-xs">{{ tr.ciudad }}</span>
                            <span class="text-xs">{{ tr.asesor }}</span>
                        </div>
                    </div>
                </vs-td>
                <vs-td class="fixed-column">
                    <div>
                        <div style="width: 200px;" class="flex flex-col gap-2">
                            <span class="flex font-bold">{{ tr.programa }}</span>
                            <span class="text-xs font-bold">Asistentes: <span class="font-normal">{{ tr.n_asistentes }}</span></span>
                            <!-- Encuestas asignadas -->
                            <div class="mt-1">
                                <vs-chip :color="parseInt(tr.cant_encuestas) > 0 ? 'success' : 'danger'" size="small">
                                    <vs-icon :icon="parseInt(tr.cant_encuestas) > 0 ? 'assignment_turned_in' : 'assignment_late'" size="13px" class="mr-1"/>
                                    {{ tr.cant_encuestas }} {{ parseInt(tr.cant_encuestas) == 1 ? 'encuesta' : 'encuestas' }}
                                </vs-chip>
                            </div>
                            <b class="text-xs">Fecha de capacitación:</b>
                            <span class="text-xs">{{ tr.fecha }}</span>
                            <span class="text-xs">{{ tr.horario}}</span>
                            <b class="text-xs">Fecha de creación:</b>
                            <p class="text-xs">{{tr.fecha_creación}}</p>
                        </div>
                    </div>
                    <br>
                    <!--ESTADO CAPACITACION-->
                    <p v-if="tr.estado_capacitacion == 0">
                        <vs-chip color="danger" transparent>Cancelada</vs-chip>
                    </p>
                    <p v-if="tr.estado_capacitacion == 1 && !tr.no_realizada">
                        <vs-chip color="warning" transparent>Pendiente</vs-chip>
                    </p>
                    <p v-if="tr.no_realizada">
                        <vs-chip color="danger" transparent>No realizada</vs-chip>
                    </p>
                    <p v-if="tr.estado_capacitacion == 2">
                        <vs-chip color="success" transparent>Realizada</vs-chip>
                    </p>
                    <!--TIPO CAPACITACION-->
                    <p v-if="tr.tipo == 0">
                        <vs-chip color="dark" transparent>Presencial</vs-chip>
                    </p>
                    <p v-if="tr.tipo == 1">
                        <vs-chip color="dark" transparent>Virtual</vs-chip>
                    </p>
                    <br><br>
                    <p v-if="tr.editor_nombre != null"><span class="text-sm">editó: </span> <i> {{ tr.editor_nombre }}</i></p>
                    <p><span class="text-sm">actualizado: </span> <i> {{ tr.updated_at }}</i></p>
                </vs-td>
                <!-- <vs-td v-for="(value, key) in tr" :key="key"
            v-if="key !== 'id' && key !== 'fecha_inicio' &&  key !== 'estado_capacitacion' && key != 'fecha_creación' && key !== 'tipo' && key !== 'periodo' && key !== 'institucion' && key !== 'ciudad' && key !== 'asesor' && key !== 'modalidad' && key !== 'programa' && key !== 'n_asistentes' && key !== 'fecha' && key !== 'horario'">
            <span v-if="value === 'Asignado'"
              style="padding: 0.5rem 1rem; background-color: #173F5F; border-radius: 10px;color: #fff; font-weight: bold;">
              {{ value }}
            </span>
            <span v-else-if="value === 'Libre'"
              style="padding: 0.5rem 1rem; background-color: #3CAEA3; border-radius: 10px;color: #fff; font-weight: bold;">
              {{ value }}
            </span>
            <span v-else>
              {{ value }}
            </span>
          </vs-td> -->
                <vs-td v-for="key in filteredKeys" :key="key">
                    <span v-if="tr[key] === 'Asignado'" style="padding: 0.5rem 1rem; background-color: #173F5F; border-radius: 10px; color: #fff; font-weight: bold;">
                        {{ tr[key] }}
                    </span>
                    <span v-else-if="tr[key] === 'Libre'" style="padding: 0.5rem 1rem; background-color: #3CAEA3; border-radius: 10px; color: #fff; font-weight: bold;">
                        {{ tr[key] }}
                    </span>
                    <span v-else>
                        {{ tr[key] }}
                    </span>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <vs-popup title="Detalles capacitación:" :active.sync="isOpen" fullscreen>
        <CapacitacionFormModal
            v-if="isOpen && capacitacion && capacitacion.id_seminario"
            mode="edit"
            :capacitacion="capacitacion"
            :periodoSelect="periodoSelect"
            :arregloCapacitadores="capacitadores"
            @rechargeSeminarios="rechargeCapacitacionEdit"
        />
    </vs-popup>

    <!-- MODAL ENCUESTAS DE CAPACITACIÓN -->
    <vs-popup title="Encuestas de la capacitación" :active.sync="modalEncuestas" style="z-index:99999;">
        <certificados-asignar-encuesta
            v-if="modalEncuestas && capacitacionEncuesta"
            :capacitacion="capacitacionEncuesta"
            :key="capacitacionEncuesta.id"
        />
    </vs-popup>
</div>
</template>
