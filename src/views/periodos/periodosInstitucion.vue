<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-popup title="Periodos" fullscreen :active.sync="modalPeriodos">
        <vs-table max-items="10" search pagination :data="listaPeriodos">
            <template slot="header">
                <vs-radio class="mb-3 m-2" color="success" v-model="f_periodos" @change="filtroPeriodos" vs-value="1">Activos</vs-radio>
                <vs-radio class="mb-3 m-2" color="danger" v-model="f_periodos" @change="filtroPeriodos" vs-value="0">Inactivos</vs-radio>
            </template>
            <template slot="thead">
                <vs-th>Periodo escolar</vs-th>
                <vs-th>Fechas</vs-th>
                <vs-th>Region</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.periodoescolar">
                        {{tr.periodoescolar}} <br>
                        <small>{{tr.descripcion}}</small>
                    </vs-td>
                    <vs-td>
                        <small>Inicio: {{tr.fecha_inicial}} </small><br>
                        <small>Fin: {{tr.fecha_final}}</small>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.region_idregion == 1"> SIERRA</vs-chip>
                        <vs-chip v-if="tr.region_idregion == 2"> COSTA</vs-chip>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.estado == 1" color="success"> Activo</vs-chip>
                        <vs-chip v-if="tr.estado == 0" color="danger"> Inactivo</vs-chip>
                    </vs-td>
                    <vs-td>
                        <vs-button type="filled" size="small" color="success" class="m-2" icon-pack="feather" icon="icon-plus" @click="verificarPeriodo(tr);">Agregar</vs-button>

                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vs-popup>


    <vx-card>
        <h4>
            {{nombreInstitucion}}
        </h4>
      
        <vs-button  v-if="estadoLimiteAcceso =='1' || usuario.id_group== '1'"  type="border" color="success" class="m-2" @click="abrirModal();">Agregar periodo</vs-button>

        <vs-table max-items="20" search pagination :data="listaPeriodosInstitucion" class="mt-4">
            <template slot="header">
                <div>
                    Cantidad: {{listaPeriodosInstitucion.length}}
                </div>
            </template>
            <template slot="thead">
                <vs-th width="40%">Periodo escolar</vs-th>
                <vs-th>Región</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Actualizado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.periodoescolar">
                        {{tr.periodoescolar}} <br>
                        <small> {{tr.descripcion}} </small>
                    </vs-td>
                    <vs-td>
                        <vs-chip> {{tr.nombreregion}}</vs-chip>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.estado == 1" color="success"> Activo</vs-chip>
                        <vs-chip v-if="tr.estado == 0" color="danger"> Inactivo</vs-chip>
                    </vs-td>
                     <vs-td>
                        {{tr.updated_at}}
                    </vs-td>
                    <vs-td>
                        <vx-tooltip text="eliminar periodo de esta institución" position="top" color="danger" v-if="usuario.id_group== '1' ">
                            <vs-button type="border" color="danger" class="m-2" icon-pack="feather" icon="icon-trash" @click="confirmaEliminar(tr);"></vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            nombreInstitucion: '',
            idInstitucion: '',
            listaPeriodos: '',
            tmplistaPeriodos: '',
            listaPeriodosInstitucion: '',
            tmp: '',
            f_periodos: 1,
            modalPeriodos: false,
            id_eliminar: '',
            region : [],
            usuario:[],
            estadoLimiteAcceso:"0",
            fecha:null,
        }
    },
  
    mounted() {
        let me = this;
        me.tmp = JSON.parse(localStorage.getItem('institucion'));
        me.nombreInstitucion = me.tmp.nombreInstitucion;
        me.idInstitucion = me.tmp.idInstitucion;
        me.region = me.tmp.nombreregion;
        me.getPeriodosInstitucion();
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
       
        me.getPeriodos();
      

    },
    methods: {
        getPeriodosInstitucion() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'periodosXInstitucion/' + me.idInstitucion)
                .then(res => {
                    me.listaPeriodosInstitucion = res.data;
                    // console.log(res.data);
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                })
        },
        getPeriodos() {
            let me = this;
            this.$http.get(this.$server_url+'periodoRegion?region='+me.region)
                .then(res => {
                    me.tmplistaPeriodos = res.data;
                    //capturo el periodo activo para limitar el acceso a agregar periodo
                    let  filtrarPeriodoAcceso = me.tmplistaPeriodos.filter(p => p.estado == '1')
                    //capturo la fecha actual
                    var fecha = moment().add(-1, 'days').format('YYYY/MM/DD');
                    
                  
                    // filtro la fecha limite del periodo
                    let fechafinal =  filtrarPeriodoAcceso.map(p => p.fhasta_limite)
                    //comparo si la fecha final ya se paso a la actual
                    if(Date.parse(fechafinal) < Date.parse(fecha)) {

                        me.estadoLimiteAcceso = "0";

                    }else{
                        me.estadoLimiteAcceso = "1";
                    }
                    
                    me.filtroPeriodos();
                })
                .catch(err => {
                    console.log(err);
                })
        },
        abrirModal() {
            let me = this;
            me.modalPeriodos = true;
        },
        filtroPeriodos() {
            let me = this;
            // console.log(me.tmplistaPeriodos)
            me.listaPeriodos = [];
            for (let index = 0; index < me.tmplistaPeriodos.length; index++) {
                if (me.tmplistaPeriodos[index].estado == me.f_periodos) {
                    me.listaPeriodos.push(me.tmplistaPeriodos[index]);
                }
            }
        },
        verificarPeriodo(item) {
            let me = this;
            // console.log(item.idperiodoescolar, me.idInstitucion)
            me.$vs.loading();
            let data = new FormData();
            data.append('idperiodoescolar', item.idperiodoescolar);
            data.append('idinstitucion', me.idInstitucion)
            this.$http.post(this.$server_url+'verifica_periodo', data)
                .then(res => {
                    // console.log(res.data)
                    if (res.data == 1) {
                        me.$vs.notify({
                            time: 8000,
                            text: 'Este periodo ya se encuentra asignado a la institucion ' + me.nombreInstitucion,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Periodo agregado correctamente a la institucion ' + me.nombreInstitucion,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.modalPeriodos = false;
                        me.getPeriodosInstitucion();
                    }
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                })
        },
        confirmaEliminar(item) {
            let me = this;
            me.id_eliminar = item.id;
            // console.log(me.id_eliminar)
            // return
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Seguro desea eliminar este item?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarItem
            })
        },
        eliminarItem() {
            let me = this;
            this.$http.get(this.$server_url+'eliminarPeriodosInstitucion/'+me.id_eliminar)
                .then(res => {
                    me.$vs.notify({
                        text: 'Periodo de esta institución eliminado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getPeriodosInstitucion();
                })
                .catch(err => {
                    console.log(err);
                })
        },
    }
}
</script>
