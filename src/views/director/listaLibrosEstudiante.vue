<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-popup title="Agregar código al estudiante" :active.sync="modalCodigo">
        <vs-input label="Ingresar código" class="vx-col sm:w-1/2" maxlength="40" v-model="ing_codigo" placeholder="MNA5-QWERTY12345" />
        <div class="mt-5">
            <vs-button class="mt-2" color="primary" type="gradient" icon-pack="feather" icon="icon-plus" @click="agregar_codigo_estudiante()">Agregar</vs-button>
        </div>
    </vs-popup>
    <vx-card>
        <vs-list-item title="Nombre" :subtitle="st_nombre"></vs-list-item>
        <vs-list-item title="Cedula" :subtitle="st_cedula"></vs-list-item>
        <vs-list-item title="Email" :subtitle="st_email"></vs-list-item>
        <div class="mt-4">
            <span>
            <vs-button class="mb-4" color="success" icon-pack="feather" icon="icon-code" @click="agregarCodigo();">Agregar código</vs-button>
            </span>

            <vs-alert :active.sync="active1" v-if="mensaje != ''" closable icon-pack="feather" close-icon="icon-x">
                {{mensaje}}
            </vs-alert>

            <vs-table max-items="30" search pagination :data="libros">
                <template slot="header">
                    Total libros adquiridos: {{libros.length}}
                </template>
                <template slot="thead">
                    <vs-th sort-key="serie">Serie</vs-th>
                    <vs-th sort-key="libro">Libro</vs-th>
                    <vs-th sort-key="anio">Año</vs-th>
                    <vs-th sort-key="codigo">Código</vs-th>
                    <vs-th sort-key="updated_at">Fecha</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].serie}}
                        </vs-td>
                        <vs-td>
                            {{data[indextr].nombrelibro}}
                        </vs-td>
                        <vs-td>
                            {{data[indextr].anio}}
                        </vs-td>
                        <vs-td>
                            {{data[indextr].codigo}}
                        </vs-td>
                        <vs-td>
                            {{data[indextr].updated_at}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>

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
            estudiante_select: '',
            st_idusuario: '',
            st_nombre: '',
            st_email: '',
            st_cedula: '',
            st_institucion: '',
            libros: '',
            mensaje: '',
            modalCodigo: false,
            ing_codigo: '',
            active1: '',
            periodo_estudiante:'',
        }
    },
    mounted() {
        let me = this;
        me.estudiante_select = JSON.parse(localStorage.getItem('student_select'));
        me.st_idusuario = me.estudiante_select.idusuario;
        me.st_nombre = me.estudiante_select.nombres + ' ' + me.estudiante_select.apellidos;
        me.st_email = me.estudiante_select.email;
        me.st_cedula = me.estudiante_select.cedula;
        me.st_institucion = me.estudiante_select.institucion_idInstitucion;
        // me.st_institucion = '66'
        // console.log(me.st_idusuario)
        me.getLibros();
    },
    methods: {
        async getLibros() {
            let me = this;
            me.$vs.loading()
            let region  = localStorage.region
            this.$http.get(this.$server_url+'codigos_libros_estudiante/' + me.st_idusuario+'/'+me.st_institucion+'/'+localStorage.periodo_id+'/'+region+'/11')
                .then(function (response) {
                    me.libros = response.data.libros
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        // getLibros() {
        //     let me = this;
        //     me.$vs.loading()
        //     me.periodo_estudiante = '';
        //     let data = new FormData();
        //     data.append('idInstitucion', me.st_institucion);
        //     data.append('idUsuario', me.st_idusuario);
        //     this.$http.post(this.$server_url + 'estudiantesLibros', data)
        //         .then(function (response) {
        //             // console.log(response.data)
        //             if (response.data.tipo != undefined) {
        //                 me.mensaje = response.data.mensaje;
        //                 me.periodo_estudiante = res.data.tipo;
        //             } else {
        //                 me.periodo_estudiante = response.data[0].id_periodo;
        //                 me.libros = response.data
        //             }
        //             me.$vs.loading.close()
        //         })
        //         .catch(function (error) {
        //             console.log(error)
        //             me.$vs.loading.close()
        //         })
        // },
        agregarCodigo() {
            let me = this;
            me.mensaje = '';
            me.ing_codigo = '';
            me.modalCodigo = true;
        },
        agregar_codigo_estudiante() {
            let me = this;
            if (me.ing_codigo == '') {
                me.$vs.notify({
                    text: 'Ingrese el código',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            me.modalCodigo = false;
            me.$vs.loading()
            let data = new FormData();
            data.append('idInstitucion', me.st_institucion);
            data.append('idUsuario', me.st_idusuario);
            data.append('codigo', me.ing_codigo);
            this.$http.post(this.$server_url + 'addLibroEstudianteDirector', data)
                .then(function (response) {
                    // console.log(response.data)
                    me.mensaje = response.data;
                    me.getLibros();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    // console.log(error)
                   me.mensaje = 'El código '+me.ing_codigo+ ' no hemos logrado encontralo en nuestra base de datos, verifique el código por favor.';
                    me.$vs.loading.close()
                })
        }
    }
}
</script>
