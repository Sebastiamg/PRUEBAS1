<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>

        <vs-breadcrumb class="mb-5">
            <li class="m-3">
                <div class="mt-2" style="font-size: 13px;">Cédula del estudiante</div>
                <vs-input v-model="cedula_student" class="mr-2" />
            </li>
            <li><br>
                <vs-button class="mt-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-search" @click="getHistCedula(cedula_student)"></vs-button>
            </li>
            <li class="m-3">
                <div class="mt-2" style="font-size: 13px;">Código del libro</div>
                <vs-input v-model="codigo_libro" class="mr-2" />
            </li>
            <li><br>
                <vs-button class="mt-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-search" @click="getHistCodigos(codigo_libro)"></vs-button>
            </li>

        </vs-breadcrumb>
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
                <div v-for="(cod1,conIndex) in listaCodigos1.historico" :key="conIndex" class="vx-col w-full sm:w-1/2 mb-base">
                    <vs-list>
                        <vs-list-item icon-pack="feather" icon="icon-activity" class="text-primary" :title="'HISTÓRICO '+(conIndex+1)"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-user" title="Usuario" :subtitle="cod1.usuario"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-code" title="Cédula" :subtitle="cod1.cedula"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-at-sign" title="Email" :subtitle="cod1.email"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-flag" title="Ciudad" :subtitle="cod1.ciudad"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-x" title="Institución en el registro" class="text-warning" v-if="cod1.institucion_historico == null" subtitle="Sin institución al momento de registrar del código"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-home" title="Institución en el registro" v-else :subtitle="cod1.institucion_historico"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-user-x" title="Usuario editor" v-if="cod1.usuario_editor == null" :subtitle="cod1.usuario"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-user-check" title="Usuario editor" v-else :subtitle="cod1.usuario_editor"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-alert-triangle" title="Acción" :subtitle="cod1.observacion"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-calendar" title="Fecha de registro" :subtitle="fechaLarga(cod1.fecha_registro)"></vs-list-item>
                    </vs-list>
                </div>
                <div v-if="listaCodigos1 != '' && listaCodigos1.historico.length == 0 ">
                    no tenemos un histórico registrado de este código
                </div>
            </div>
        </section>
    </vx-card>
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
            cedula_student: '',
            codigo_libro: '',
            listaCodigos: [],
            listaCodigos1: [],
        }
    },
    mounted() {},
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
        }
    }
}
</script>
