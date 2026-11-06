<template>
<div class="w-full mb-base">
    <vs-popup title="Detalles capacitación" :active.sync="modalAdd">
        <h3 class="mb-4">{{agenda_editar.titulo}} </h3>
        <div>Marcar la capacitacion actual como:</div>
        <vs-radio class="m-3" color="warning" v-model="agenda_editar.estado" vs-name="radios2" vs-value="1">Pendiente</vs-radio>
        <vs-radio class="m-3" color="success" v-model="agenda_editar.estado" vs-name="radios2" vs-value="2">Realizada</vs-radio>
        <vs-radio class="m-3" color="danger" v-model="agenda_editar.estado" vs-name="radios2" vs-value="0">Cancelada</vs-radio>

        <div class="mt-3">
            <p>Fecha capacitación</p>
            <flat-pickr :config="configdateTimePicker" v-model="agenda_editar.endDate"  placeholder="Fecha capacitación" class="m-1" style="display: inline-block;width: 100%;" />
        </div>

        <!-- <div class="mt-3">
              <p>Fecha  fin capacitación</p>
            <flat-pickr :config="configdateTimePicker" v-model="agenda_editar.endDate"  placeholder="Fecha Fin" class="m-1" style="display: inline-block;width: 100%;" />
        </div> -->
        <div class="mt-3">

            <vs-input type="number" v-model="agenda_editar.personas" label="Cantidad de asistentes"></vs-input>
        </div>
        <div class="mt-3">
            <vs-textarea v-model="agenda_editar.observacion" :counter="counter_long" label="observación" height="130px" :counter-danger.sync="counterDanger"></vs-textarea>
        </div>
        <div>
            <vs-button class="mt-5" color="primary" @click="f_aceptar_modal()" type="filled">Aceptar</vs-button>
        </div>
    </vs-popup>
    <!-- <vx-card> -->
    <div class="m-3">
        <vs-radio class="m-3" v-model="region" vs-name="radios1" vs-value="SIERRA" @change="f_periodo(region)">SIERRA</vs-radio>
        <vs-radio class="m-3" v-model="region" vs-name="radios1" vs-value="COSTA" @change="f_periodo(region)">COSTA</vs-radio>
        <div class="m-3">
            <vs-input style="display:inline-block" type="date" v-model="filtro_fecha_ini" class="mb-4 mr-4 col-3 sm:col-12" label="Fecha inicio"></vs-input>
            <vs-input style="display:inline-block" type="date" v-model="filtro_fecha_fin" class="mb-4 mr-4 col-3 sm:col-12" label="Fecha fin"></vs-input>
            <vs-select style="display:inline-block; min-width:250px" class="mr-2" autocomplete label="Asesores" v-model="m_asesores">
                <vs-select-item :key="index" :value="item" :text="item.nombres" v-for="(item,index) in lista_asesores" />
            </vs-select>
            <vs-button style="display:inline-block" @click="f_filtro_fechas();" radius icon-pack="feather" icon="icon-filter" color="primary" type="filled"></vs-button>
            <vs-button style="display:inline-block" class="ml-3" @click="f_filtro_fechas(0);" radius icon-pack="feather" icon="icon-x" color="warning" type="filled"></vs-button>
        </div>
    </div>
    <vs-table multiple v-model="codigoSelected" pagination max-items="10" search :data="tmp_agenda_capacitaciones">

        <template slot="header" style="display:flex;">
            <div>
                  Cantidad:<b> {{tmp_agenda_capacitaciones.length}}</b>
            </div>
            <div class="ml-5">
                <vs-button color="warning" size="small" class="mr-5" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
            </div>
        </template>

        <template slot="thead">
            <vs-th sort-key="tema" width="25%">Tema</vs-th>
            <vs-th sort-key="institucion" width="25%">Institución</vs-th>
            <vs-th sort-key="fechaCapacitacion" width="25%">Fecha</vs-th>
            <vs-th sort-key="" width="20%"></vs-th>
        </template>

        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                <vs-td :data="data[indextr].tema">
                    {{data[indextr].tema}}<br>
                    <small>Area: {{data[indextr].nombrearea}}</small><br>
                    <small>Capacitador: {{data[indextr].capacitador}}</small>
                    <span v-if="data[indextr].estado == 0"><br>
                        <vs-chip color="danger">Cancelada</vs-chip>
                    </span>
                    <span v-if="data[indextr].estado == 1"><br>
                        <vs-chip color="warning">Pendiente</vs-chip>
                    </span>
                    <span v-if="data[indextr].estado == 2"><br>
                        <vs-chip color="success">Realizada</vs-chip>
                    </span>
                     <vs-chip :color="data[indextr].classes.substring(6)">{{data[indextr].label}}</vs-chip>
                     <vs-chip color="primary">{{tr.tipo =='0'?'Presencial':'Virtual'}}</vs-chip>
                </vs-td>

                <vs-td :data="data[indextr].nombreInstitucion">
                    <span v-if="data[indextr].institucion_id != null">{{data[indextr].nombreInstitucion}}</span>
                    <span v-if="data[indextr].idInstitucionTemporal != null">{{data[indextr].institucionTemporal}}</span>
                    <small><br>Asesor: {{data[indextr].asesorNombre}} {{data[indextr].asesorApellido}} </small>
                    <small><br>cedula: {{data[indextr].cedula}}</small>
                </vs-td>

                <vs-td :data="data[indextr].fechaFinCapacitacion">
                    <!-- <small>Inicio:</small> {{data[indextr].fechaCapacitacion.substr(0,10)}}<br> -->
                    <small>Fecha capacitación:</small><br/>{{data[indextr].fechaFinCapacitacion}}<br>
                    <small>Hora Inicio:</small><br/> {{data[indextr].hora_inicio}}<br>
                    <small>Hora fin:</small><br/> {{data[indextr].hora_fin}}<br>
                    <small>Fecha create:</small><br/> {{data[indextr].created_at}}<br>
                    <small>Fecha actualización:</small><br/> {{data[indextr].updated_at}}<br>
                </vs-td>
                <vs-td :data="data[indextr].estado">
                    <vs-button style="display:inline-block" @click="f_cambio_estado(tr);" radius icon-pack="feather" icon="icon-more-vertical" color="primary" type="border"></vs-button>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!-- </vx-card> -->
       <!--modal exportar-->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">

            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
            <div class="flex">
                <!--<span class="mr-4">Cell Auto Width:</span>
                <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
            </div>
        </vs-prompt>
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
        flatPickr
    },
    data() {
        return {
            agenda_capacitaciones: '',
            tmp_agenda_capacitaciones: '',
            region: '',
            radios1: '',
            periodos: '',
            sel_region: '',
            tmp_sel_region: '',
            modalAdd: false,
            agenda_editar: {
                'id': '',
                'estado': '',
                'observacion': '',
                'personas': '',
                'startDate':'',
                'endDate':'',
            },
            counterDanger: false,
            counter_long: 300,
            filtro_fecha_ini: '',
            filtro_fecha_fin: '',
            lista_asesores: '',
            m_asesores: '',
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            //para exportar
            codigoSelected:[],
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            fileName:null,
            selectedFormat: 'xls',
            cellAutoWidth: true,
            activePrompt: false,
        }
    },
    mounted() {
        let me = this;
        me.tmp_sel_region = localStorage.getItem('sel_region');
        if (me.tmp_sel_region != null) {
            // console.log(me.tmp_sel_region)
            me.f_periodo(me.tmp_sel_region)
            me.region = me.tmp_sel_region;
        }
        me.f_lista_Asesores();
    },
    methods: {
        f_periodo(item) {
            let me = this;
            localStorage.setItem('sel_region', item);
            let tmp_item = item;
            // console.log(tmp_item)
            // return
            let formData = new FormData();
            formData.append('region', tmp_item);
            this.$http.post(this.$server_url + 'periodoActivoReg', formData)
                .then(function (res) {
                    // console.log(res.data)
                    me.periodos = res.data;
                    me.getAgendaCapacitacion();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getAgendaCapacitacion() {
            let me = this;
            me.$vs.loading()
            me.modalAdd = false;
            this.$http.get(this.$server_url + 'agenda_capacitacion/' + me.periodos[0].idperiodoescolar)
                .then(function (res) {
                    me.agenda_capacitaciones = res.data
                    me.f_array_filtro_contenido();
                    // console.log(res.data)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        f_array_filtro_contenido() {
            let me = this;
            me.tmp_agenda_capacitaciones = [];
            if (me.filtro_fecha_ini != "") { //filtro con fecha inicio
                if (me.filtro_fecha_fin != "") { //filtro con fecha inicio y fin
                    if (me.m_asesores != "") { //filtro fecha inicio, fecha fin y asesor
                        // console.log('f ini f_fin y asesor')
                        for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
                            if (me.agenda_capacitaciones[index].fechaCapacitacion.substr(0, 10) >= me.filtro_fecha_ini &&
                                me.agenda_capacitaciones[index].fechaFinCapacitacion.substr(0, 10) <= me.filtro_fecha_fin &&
                                me.agenda_capacitaciones[index].cedula == me.m_asesores.cedula) {
                                me.tmp_agenda_capacitaciones.push(me.agenda_capacitaciones[index])
                            }
                        }
                    } else { //filtro fecha inicio, fecha fin sin asesor
                        // console.log('f ini f_fin')
                        for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
                            if (me.agenda_capacitaciones[index].fechaCapacitacion.substr(0, 10) >= me.filtro_fecha_ini &&
                                me.agenda_capacitaciones[index].fechaFinCapacitacion.substr(0, 10) <= me.filtro_fecha_fin) {
                                me.tmp_agenda_capacitaciones.push(me.agenda_capacitaciones[index])
                            }
                        }
                    }
                } else if (me.m_asesores != "") { //filtro con fecha inicio y asesor
                    // console.log('f_inic y asesor')
                    for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
                        if (me.agenda_capacitaciones[index].fechaCapacitacion.substr(0, 10) >= me.filtro_fecha_ini &&
                            me.agenda_capacitaciones[index].cedula == me.m_asesores.cedula) {
                            me.tmp_agenda_capacitaciones.push(me.agenda_capacitaciones[index])
                        }
                    }
                } else { //filtro con fecha inicio y asesor
                    // console.log('solo f_inic')
                    for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
                        if (me.agenda_capacitaciones[index].fechaCapacitacion.substr(0, 10) >= me.filtro_fecha_ini) {
                            me.tmp_agenda_capacitaciones.push(me.agenda_capacitaciones[index])
                        }
                    }
                }
                return
            }
            if (me.filtro_fecha_fin != "") { //filtro con fecha fin
                if (me.m_asesores != "") {
                    // console.log('f_fin y asesor')
                    for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
                        if (me.agenda_capacitaciones[index].fechaFinCapacitacion.substr(0, 10) <= me.filtro_fecha_fin &&
                            me.agenda_capacitaciones[index].cedula == me.m_asesores.cedula) {
                            me.tmp_agenda_capacitaciones.push(me.agenda_capacitaciones[index])
                        }
                    }
                } else {
                    // console.log('solo_f_fin')
                    for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
                        if (me.agenda_capacitaciones[index].fechaFinCapacitacion.substr(0, 10) <= me.filtro_fecha_fin) {
                            me.tmp_agenda_capacitaciones.push(me.agenda_capacitaciones[index])
                        }
                    }
                }
                return
            }
            if (me.m_asesores != "") { //filtro con asesor
                // console.log('solo_asesor')
                for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
                    if (me.agenda_capacitaciones[index].cedula == me.m_asesores.cedula) {
                        me.tmp_agenda_capacitaciones.push(me.agenda_capacitaciones[index])
                    }
                }
                return
            }
            // console.log('sin fechas, sin asesor')
            me.tmp_agenda_capacitaciones = me.agenda_capacitaciones;
        },
        f_lista_Asesores(item) {
            let me = this;
            this.$http.get(this.$server_url + 'listaAsesores')
                .then(function (res) {
                    me.lista_asesores = res.data
                    // console.log(res.data)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        f_cambio_estado(item) {
            let me = this;
            me.agenda_editar.id = item.id;
            me.agenda_editar.titulo = item.tema;
            me.agenda_editar.personas = item.personas;
            me.agenda_editar.estado = item.estado;
            me.agenda_editar.observacion = item.observacion;
            me.agenda_editar.startDate = item.fechaCapacitacion;
            me.agenda_editar.endDate = item.fechaFinCapacitacion
            console.log(item)
            me.modalAdd = true;
        },

        f_aceptar_modal() {
            let me = this;
            let formData = new FormData();
            formData.append('id', me.agenda_editar.id);
            formData.append('personas', me.agenda_editar.personas);
            formData.append('estado', me.agenda_editar.estado);
            formData.append('observacion', me.agenda_editar.observacion);
            formData.append('endDate', me.agenda_editar.endDate);
            me.$vs.loading()
            console.log(me.agenda_editar)
            this.$http.post(this.$server_url + 'editar_agenda_adm', formData)
                .then(function (res) {
                    me.agenda_capacitaciones = res.data
                    // console.log(res.data)
                    me.getAgendaCapacitacion();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        f_filtro_fechas(item) {
            let me = this;
            if (item == 0) {
                me.filtro_fecha_ini = "";
                me.filtro_fecha_fin = "";
                me.m_asesores = ""
            }
            me.f_array_filtro_contenido();
        },
        //para importar a excel
        exportToExcel() {
            let headerTitle = [ 'Tema','Area', 'Capacitador', 'Asesor', 'Institucion', 'Fecha capacitación','Hora inicio','Hora fin','fecha create','estado'];
            let headerVal = [ 'tema','nombrearea', 'capacitador','asesor', 'institucionFinal','fechaFinCapacitacion','hora_inicio','hora_fin','created_at','estadoCapacitacion'];
            import('@/vendor/Export2Excel').then(excel => {
                const data = this.formatJson(headerVal, this.codigoSelected)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
            //limpiar campos para exportar de nuevo
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
    },
}
</script>

<style lang="css">
.select-asesores {
    text-transform: uppercase
}
</style>
