<template>
    <div>
        <vs-card>
            <div class="flex mb-4">
                <div class="w-2/3 p-2 bg-gray-400 text-center flex">
                    <p>Filtro por Asignaturas</p>
                    <v-select @input="filtrarListado(1)" :options="Asignaturas" :reduce="Asignaturas => Asignaturas.idasignatura" label="nombreasignatura" class="w-full" v-model="historico.asignatura" />
                    <vx-tooltip style="display: inline-block;" text="Mostrar todo" position="top" color="success">
                        <vs-button class="ml-2" @click="filtrarListado(2)" radius color="warning" type="gradient" icon="close"></vs-button>
                    </vx-tooltip> 
                </div>
                <div class="w-2/3 p-2 bg-gray-400 text-center flex">
                    <div>
                        <ul class="flex mt-3">
                            <li>
                            <vs-radio v-model="tipo" @input="getHistorico()" vs-name="tipo" vs-value="1">Actividades</vs-radio>
                            </li>
                            <li>
                            <vs-radio v-model="tipo" @input="getHistorico()"  class="ml-2" vs-name="tipo" vs-value="2">Material de apoyo</vs-radio>
                            </li>
                            <li>
                            <vs-radio v-model="tipo" @input="getHistorico()"  class="ml-2" vs-name="tipo" vs-value="3">Animaciones</vs-radio>
                            </li>
                            <li>
                            <vs-radio v-model="tipo" @input="getHistorico()"  class="ml-2" vs-name="tipo" vs-value="4">Teletareas</vs-radio>
                            </li>
                            <li>
                            <vs-radio v-model="tipo" @input="getHistorico()"  class="ml-2" vs-name="tipo" vs-value="5">Juegos</vs-radio>
                            </li>
                            <li>
                            <vs-radio v-model="tipo" @input="getHistorico()"  class="ml-2" vs-name="tipo" vs-value="6">Videos</vs-radio>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <vs-table   pagination max-items="25" search :data="tmparregloHistorico">
                <template slot="header">
                    <div style="display:flex;">
                        <vs-chip color="success" style="font-size:12px;">
                          Total Historico: {{tmparregloHistorico.length}}
                        </vs-chip>
                    </div>    
                </template>
                <template slot="thead">
                    <vs-th sort-key="nombreasignatura">Asignatura</vs-th>
                    <vs-th sort-key="nombreasignatura">Usuario</vs-th>
                    <vs-th sort-key="nombreasignatura">Fecha de visita</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombreasignatura">
                            <p style="font-weight:bold;">Asignatura:</p>
                            <span>{{ data[indextr].nombreasignatura }}</span><br/>
                            <p style="font-weight:bold;">
                                <span v-if="tipo == 1">Actividad:</span>
                                <span v-if="tipo == 2">Nombre material:</span>
                                <span v-if="tipo == 3">Animación:</span>
                                <span v-if="tipo == 4">Teletarea:</span>
                                <span v-if="tipo == 5">Juegos:</span>
                                <span v-if="tipo == 6">Video:</span>
                            </p>
                            <span>{{ data[indextr].actividad }}</span>
                            <p v-if="tipo== '1' || tipo == '3'" style="font-weight:bold;">Pagina:</p>
                            <span v-if="tipo== '1' || tipo == '3'">{{ data[indextr].pagina }}</span>
                        </vs-td>
                        <vs-td :data="data[indextr].nombreasignatura">
                            <p style="font-weight:bold;">Nombres:</p>
                            <span>{{ data[indextr].persona }}</span>
                            <p style="font-weight:bold;">Rol:</p>
                            <span class="text-warning font-bold">{{ data[indextr].rol }}</span>
                            <p style="font-weight:bold;">Institucion:</p>
                            <span>{{ data[indextr].nombreInstitucion }}</span>
                            <p style="font-weight:bold;">Periodo:</p>
                            <span>{{ data[indextr].periodo }}</span>
                        </vs-td>
                        <vs-td :data="data[indextr].nombreasignatura">
                            <small>{{ tr.created_at }}</small>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-card>
     </div>  
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
import jsPDF from 'jspdf' 
import html2canvas from "html2canvas"
import {
    getIdFromUrl
} from 'vue-youtube'
export default {
    data(){
        return{
            usuario:[],
            arregloHistorico:[],
            tmparregloHistorico:[],
            Asignaturas:[],
            historico:{
                asignatura:'',
            },
            tipo:1,
        }
    },
   
    methods:{
        //para obtener el listado de asignaturas
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url + 'getAsignaturas')
                .then(function (res) {
                    me.Asignaturas = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
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
        filtrarListado(tipo){
            let me = this;
            me.tmparregloHistorico = []
            //todo
            if(tipo == 2){
                 me.tmparregloHistorico = me.arregloHistorico;
                 me.historico.asignatura     = ""
            }
            //filtro
            else{
                if(me.historico.asignatura == "" || me.historico.asignatura == null || me.historico.asignatura == undefined){
                me.$vs.notify({
                    text: "Tiene que seleccionar una asignatura",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.tmparregloHistorico = me.arregloHistorico;
                return
                }
                let datos = me.arregloHistorico;
                me.tmparregloHistorico = datos.filter(p => p.asignatura_id == me.historico.asignatura)
            }    
        },
    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getHistorico()
        me.getAsignaturas() 
    },
    components: {
        'v-select': vSelect,  
    },
}
</script>
<style>
#botonreporte{
    display:none;
}
#botonexcel{
    display:none;
    margin:0 10px;
}
</style>