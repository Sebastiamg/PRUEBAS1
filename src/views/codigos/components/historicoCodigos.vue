<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>

        <!-- <vs-breadcrumb class="mb-5">
            <li class="m-3" v-if="usuario.id_group != 17">
                <div  class="mt-2" style="font-size: 13px;">Cédula del estudiante</div>
                <vs-input v-model="cedula_student" @keyup.enter="getHistCodigos(codigo_libro)" class="mr-2" />
            </li>
            <li class="m-3">
                <div class="mt-2" style="font-size: 13px;">Código del libro</div>
                <vs-input v-model="codigo_libro" @keyup.enter="getHistCodigos(codigo_libro)" class="mr-2" />
            </li>
        </vs-breadcrumb> -->
        <section class="consulta-por-cedula" v-if="listaCodigos.length > 0">
            <div>
                <div class="vx-row">
                    <div class="vx-col sm:w-1/2 w:full"> Nombre: {{listaCodigos[0].usuario}} </div>
                    <div class="vx-col sm:w-1/2 w:full"> Cedula: {{listaCodigos[0].cedula}} </div>
                    <div class="vx-col sm:w-1/2 w:full"> Email: {{listaCodigos[0].email}} </div>
                    <div class="vx-col sm:w-1/2 w:full"> Ciudad: {{listaCodigos[0].ciudad}} </div>
                    <div class="vx-col w-1/1"> Institución: {{listaCodigos[0].nombreInstitucion}} </div>
                </div>
            </div>
            <vs-table pagination max-items="30" search :data="listaCodigos">
                <template slot="header">
                    <div class="vx-col w-1/1"> Cantidad de códigos: &nbsp; <b>{{listaCodigos.length}}</b> </div>
                </template>
                <template slot="thead">
                    <vs-th sort-key="docente">Código</vs-th>
                    <vs-th sort-key="libro">Libro</vs-th>
                    <vs-th sort-key="anio">anio</vs-th>
                    <vs-th sort-key="anio">Periodo</vs-th>
                    <vs-th sort-key="anio">estado</vs-th>
                    <vs-th sort-key="anio">fechas</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].codigo_libro">
                            {{ data[indextr].codigo_libro }}
                        </vs-td>
                        <vs-td :data="data[indextr].libro">
                            {{ data[indextr].serie }}<br>
                            {{ data[indextr].libro }}
                        </vs-td>
                        <vs-td :data="data[indextr].anio">
                            {{ data[indextr].anio }}
                        </vs-td>
                        <vs-td :data="data[indextr].descripcion">
                            {{ data[indextr].descripcion }}
                        </vs-td>
                        <vs-td :data="data[indextr].observacion">
                            {{ data[indextr].observacion }}
                        </vs-td>
                        <vs-td :data="data[indextr].fecha_create">
                            <small>Actualizado: {{ data[indextr].fecha_observacion }} <br>
                                Creado: {{ data[indextr].fecha_create }}</small>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </section>
        <section class="consulta-por-codigo-libro">
            <div class="vx-row">
                <!-- REGISTRO DE CODIGO -->
                <div class="vx-col w-full sm:w-1/2 mb-base" v-for="(section,index) in listaCodigos1.registro" :key="index">
                    <vs-list>
                        <span v-if="section.idusuario == 0">
                            <vs-list-item icon-pack="feather" icon="icon-activity" class="text-success" title="SIN USO"></vs-list-item>
                        </span>
                        <span v-else>
                            <vs-list-item icon-pack="feather" icon="icon-activity" class="text-warning" title="USADO"></vs-list-item>
                        </span>
                        <vs-list-item icon-pack="feather" icon="icon-user" title="Serie" :subtitle="section.serie"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-code" title="Libro" :subtitle="section.libro"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-at-sign" title="Fecha creación" :subtitle="fechaLarga(section.fecha_create)"></vs-list-item>
                        <span v-if="section.idusuario == 0">
                            <vs-list-item icon-pack="feather" icon="icon-user-x" title="Usuario" class="text-success" subtitle="Este código aún no ha sido usado "></vs-list-item>
                        </span>
                        <span v-else>
                            <vs-list-item icon-pack="feather" icon="icon-user-check" title="Usuario" :subtitle="section.nombres +' '+ section.apellidos"></vs-list-item>
                            <vs-list-item icon-pack="feather" icon="icon-check-circle" title="Institución actual" :subtitle="section.nombreInstitucion"></vs-list-item>
                            <vs-list-item icon-pack="feather" icon="icon-bookmark" title="Periodo escolar" v-if="section.periodoescolar != null" :subtitle="section.periodoescolar + ' - ' +section.periododescripcion"></vs-list-item>
                            <vs-list-item icon-pack="feather" icon="icon-bookmark" title="Periodo escolar" class="text-danger" v-else subtitle="Sin periodo escolar"></vs-list-item>
                            <vs-list-item icon-pack="feather" icon="icon-flag" title="Ciudad" :subtitle="section.nombre_ciudad"></vs-list-item>
                            <vs-list-item icon-pack="feather" icon="icon-alert-triangle" title="Acción" subtitle="registrado"></vs-list-item>
                            <vs-list-item icon-pack="feather" icon="icon-calendar" title="Fecha de registro" :subtitle="fechaLarga(section.actualizado)"></vs-list-item>
                        </span>
                    </vs-list>
                </div>
                <!-- HISTORICO DEL CODIGO -->
                <vs-divider>HISTORICO</vs-divider>
                <vs-table v-if="listaCodigos1 != ''" pagination max-items="10" search :data="listaCodigos1.historico" style="width:100%;">
                    <template slot="header">
                        <div class="vx-col w-1/1"> Cantidad de historicos: &nbsp; <b>{{listaCodigos1.historico.length}}</b> </div>
                    </template>
                    <template slot="thead">
                        <vs-th width="20%" sort-key="docente">Usuario</vs-th>
                        <vs-th width="20%" sort-key="libro">historico</vs-th>
                        <vs-th width="20%" sort-key="anio">Fecha de registro</vs-th>
                        <vs-th width="40%" sort-key="anio">Acción</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].usuario">
                                <span class="font-bold">Nombres:</span>
                                <p>{{ tr.usuario }}</p>
                                <span class="font-bold">Cedula:</span>
                                <p>{{ tr.cedula }}</p>
                                <span class="font-bold">Institucion:</span>
                                <p>{{ tr.institucion_usuario }}</p>
                                <span class="font-bold">Ciudad:</span>
                                <p>{{ tr.ciudad }}</p>
                            </vs-td>
                            <vs-td :data="data[indextr].periodo_historico">
                                <div v-if="tr.tipo_tabla == '1'">
                                  <b class="text-warning">Tabla de devolución de códigos</b>
                                </div>
                                <span class="font-bold">Editor:</span>
                                <p>{{ tr.usuario_editor }}</p>
                                <span class="font-bold">Institucion historico:</span>
                                <p>{{ tr.institucion_historico }}</p>
                                <span class="font-bold">Periodo historico:</span>
                                <p>{{ tr.periodo_historico }}</p>
                            </vs-td>
                            <vs-td :data="data[indextr].fecha_registro">
                                <small>{{ tr.fecha_registro }}</small>
                            </vs-td>
                            <vs-td :data="data[indextr].observacion">
                                {{ data[indextr].observacion }}
                                <!--DEVOLUCION-->
                                <!-- <div v-if="tr.devolucion > 0">
                                    <vs-divider v-if="(usuario.id_group == 1 || usuario.id_group == 17 || usuario.idusuario == 553 || usuario.idusuario == 45550)"></vs-divider>
                                    <vs-button size="small"  v-if="(usuario.id_group == 1 || usuario.id_group == 17 || usuario.idusuario == 553 || usuario.idusuario == 45550)" color="primary" icon="info" type="filled" @click="returnCodes(tr);">
                                        Ver devolución
                                    </vs-button>
                                </div> -->
                                <!--END DEVOLUCION--><p style="font-weight: bold;">Old values </p>
                                {{tr.old_values}}<br>
                                <p style="font-weight: bold;">New values </p>
                                {{tr.new_values}}<br>
                            </vs-td>
                        </vs-tr>
                    </template>
            </vs-table>
                <div v-if="listaCodigos1 != '' && listaCodigos1.historico.length == 0 ">
                    no tenemos un histórico registrado de este código
                </div>
            </div>
        </section>

    </vx-card>
    <!--MODAL PARA VER LA DEVOLUCION-->
    <vs-popup class="holamundo" fullscreen :title="titleReturns" :active.sync="popupReturns">
        <vs-table max-items="3"  search pagination :data="devoluciones">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: {{ devoluciones.length }}</vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Codigo</vs-th>
                    <vs-th>Devolucion</vs-th>
                    <vs-th>Observacion</vs-th>
                    <vs-th>Editor</vs-th>
                    <vs-th>Estado</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{ tr.codigo }}
                        </vs-td>
                        <vs-td>
                            <p style="font-weight:bold;">Fecha devolucion:</p>
                            <span>{{ data[indextr].fecha_devolucion }}</span>
                            <p style="font-weight:bold;">Periodo:</p>
                            <span>{{tr.periodoescolar}}</span>
                            <p style="font-weight:bold;">Institucion:</p>
                            <span>{{tr.nombreInstitucion}}</span>
                                <p style="font-weight:bold;">Cliente:</p>
                            <span>{{tr.cliente}}</span>
                        </vs-td>
                        <vs-td>
                            {{ tr.observacion }}
                        </vs-td>
                        <vs-td>
                            {{ tr.editor }}
                        </vs-td>
                        <vs-td>
                            <vs-chip color="success" v-if="tr.estado == '1'">Activo</vs-chip>
                            <vs-chip color="warning" v-else>Desactivado</vs-chip>
                        </vs-td>
                    </vs-tr>
                </template>
        </vs-table>
    </vs-popup>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            usuario:[],
            cedula_student: '',
            codigo_libro: '',
            listaCodigos: [],
            listaCodigos1: [],
            devoluciones:[],
            popupReturns:false
        }
    },
    props:{
        codigo:{
            type:String,
            default:""
        },
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getHistCodigos(me.codigo.codigo)
    },
    methods: {
        getHistCedula(cedula) {
            let me = this;
            if (cedula == '') {
                me.$vs.notify({
                    time: 5000,
                    text: ' ¿ Y la cédula del estudiante ? ',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.loading();
            this.$http.get(this.$server_url+'getHistoricoCodigos/' + cedula)
                .then(res => {
                    me.listaCodigos = res.data;
                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.log('error con la api de historico libros  ' + error);
                    me.$vs.loading.close();
                })
        },
        getHistCodigos(codigo) {
            let me = this;
            me.listaCodigos1 = [];
            if (codigo == '') {
                me.$vs.notify({
                    time: 5000,
                    text: ' ¿ Y el código del libro ? ',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.loading();
            this.$http.get(this.$server_url+'historico_codigo/' + codigo)
                .then(res => {
                    console.log(res.data);
                    me.listaCodigos1 = res.data;
                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.log('error con la api de historico libros  ' + error);
                    me.$vs.loading.close();
                })
        },
        //methods to return codes
        returnCodes(tr){
            let me = this
            me.titleReturns = "Informacion de devoluciones del codigo "+tr.codigo_libro
            me.$vs.loading();
            this.$http.get(this.$server_url+'codigo/devoluciones/' + tr.codigo_libro)
              .then(res => {
                me.$vs.loading.close();
                me.devoluciones = res.data
                me.popupReturns = true;
            })
            .catch(function(e){
                me.$vs.loading.close();
            });
        },
    }
}
</script>
