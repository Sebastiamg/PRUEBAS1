<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-popup classContent="popup-example" v-if="datos_imagen != ''" title="Portada" :active.sync="modal_imagen">
        <div class="text-center">
            <img style="height:300px" :src="$data_url+datos_imagen.ruta_portada+'/'+datos_imagen.nombre_portada" alt="">
        </div>
    </vs-popup>
    <vs-popup classContent="popup-example" :title="titleModal" :active.sync="mod_articulos">
        <div class="vx-row p-1">
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px; ">Nombre: </div>
                <vs-input type="text" class="inputx w-full" v-model="nombre" maxlength="100"></vs-input>
            </div>
            <div class="vx-col w-full mt-2" align="left">
                <div style="font-size: 12px; ">Descripción: </div>
                <vs-textarea type="text" class="inputx w-full" v-model="descripcion"></vs-textarea>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-2" align="left">
                <div style="font-size: 12px; ">Área: </div>
                <v-select class="mb-4 w-full" v-model="asignaturaSelect" :options="asignaturas" label="nombre" :reduce="asignaturas => asignaturas" />
                <!-- {{asignaturaSelect}} -->
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-2" align="center">
                <div style="font-size: 12px; ">Estado: </div>
                <vs-switch class="" vs-icon-on="check" color="success" v-model="estado" style="width: 100px;">
                    <span slot="on">Publicada</span>
                    <span slot="off">Inactivo</span>
                </vs-switch>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div class="borde-unidad">
                    <div v-if="archivo">
                        <p><b>Archivo actual:</b></p>
                        <p>{{archivo}}</p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(archivo)" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Eliminar" position="bottom" style="display: inline-block" color="danger">
                                <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-x" color="danger" type="border" @click="quitarArchivo(1,archivo)"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                    <div v-else>
                        <div style="font-size: 12px;">Archivo: </div>
                        <input v-if="porcentaje == 0" type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                        <div class="v-row text-left" v-if="porcentaje>0">
                            <vs-progress style="height:25px" :percent="porcentaje" color="success"> {{porcentaje}}% </vs-progress>
                        </div><br>
                        <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                    </div>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div class="borde-unidad">
                    <div v-if="portada != ''">
                        <p><b>Portada actual:</b></p>
                        <p> {{portada}}</p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(portada)" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Eliminar" position="bottom" style="display: inline-block" color="danger">
                                <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-x" color="danger" type="border" @click="quitarArchivo(2,portada)"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                    <div v-else>
                        <div style="font-size: 12px;">Portada: </div>
                        <input v-if="porcentajep == 0" type="file" id="filep" ref="filep" accept="image/x-png,image/gif,image/jpeg" v-on:change="portadaUpload()" />
                        <div class="v-row text-left" v-if="porcentajep>0">
                            <vs-progress style="height:25px" :percent="porcentajep" color="success"> {{porcentajep}}% </vs-progress>
                        </div><br>
                        <small>Tamaño máximo: {{limitePortada}} mb.</small>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full m-1">
                <vs-button style="display: inline" class="m-1" @click="subirArchivo()" size="medium" icon-pack="feather" icon="icon-save" :color="btn_color" type="gradient">{{btn_texto}} </vs-button>
            </div>
        </div>
    </vs-popup>
    <vx-card>
        <vs-button class="m-1" @click="crearPublicacion()" color="success">Agregar</vs-button>
        <vs-button class="m-1" @click="verArticulos()" color="warning">Ver artículos</vs-button>
        <vs-table max-items="10" search pagination :data="publicaciones" class="stripe">
            <template slot="header">
                <p>Total de articulos registrados: <b>{{publicaciones.length}}</b> </p>
            </template>
            <template slot="thead">
                <vs-th width="40%">Nombre</vs-th>
                <vs-th width="35%">Archivo</vs-th>
                <vs-th width="15%">Estado</vs-th>
                <vs-th width="10%">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombre}} <br>
                        <small>{{data[indextr].descripcion}}</small> <br>
                        <small>
                            <b>Área</b> {{data[indextr].area}}
                        </small>
                    </vs-td>
                    <vs-td>
                        <span v-if="data[indextr].nombre_archivo != null">
                            <i class="text-primary cursor-pointer" @click="verArticulo(data[indextr])"><u>{{data[indextr].nombre_archivo}}</u></i>
                        </span>
                        <span v-else class="text-danger"><i> Sin archivo</i></span> <br>
                        <span v-if="data[indextr].nombre_portada == null" class="text-danger" style="font-size:10px"><i> Sin portada</i></span>
                        <span v-else>
                            <vs-avatar size="large" :src="$data_url+data[indextr].ruta_portada+'/'+data[indextr].nombre_portada" @click="f_zoom_img(data[indextr])" />
                        </span>
                    </vs-td>
                    <vs-td>
                        <small v-if="data[indextr].estado == 1" class="text-success"> Publicado</small>
                        <small v-else class="text-danger">Inactivo</small><br>
                        <small> {{data[indextr].updated_at | fecha}} </small>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip style="display: inline-block;" text="editar publicación" position="top" color="success">
                            <vs-button @click="editaArticulo(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="eliminar publicaciòn" position="top" color="danger">
                            <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
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
import moment from "moment";
Vue.filter('fecha', function (value) {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD HH:mm')
    }
});
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            publicaciones: '',
            elimita_contenido_articulo: '',
            usuario: [],
            grupo_usuario: '',
            titleModal: '',
            mod_articulos: false,
            asignaturas: [{
                    'id': '1',
                    'nombre': 'Lengua'
                },
                {
                    'id': '2',
                    'nombre': 'Matemática'
                },
                {
                    'id': '3',
                    'nombre': 'Ciencias Naturales'
                },
                {
                    'id': '4',
                    'nombre': 'Ciencias Sociales'
                },
                {
                    'id': '5',
                    'nombre': 'Enseñanza educación'
                },
                {
                    'id': '6',
                    'nombre': 'Robótica'
                }
            ],
            asignaturaSelect: {
                'id': '',
                'nombre': ''
            },
            archivo: '',
            portada: '',
            porcentaje: 0,
            id_pub: '',
            nombre: '',
            descripcion: '',
            estado: true,
            edita: '',
            datosEditar: '',
            porcentajep: 0,
            limiteMegas: 10, //permitir maximo de megas
            limitePortada: 0.7, //permitir maximo de megas en la portada
            bytes: 1048576, //para calculo de megas
            pesoArchivo: 0,
            muyPesado: false,
            pesoArchivop: 0,
            muyPesadop: false,
            idusuario: '',
            file: '',
            filep: '',
            id_eliminar: '',
            tipo: '',
            btn_color: '',
            btn_texto: '',
            datos_imagen: '',
            modal_imagen: false,
            replace_archivo: '',
            replace_portada: '',
            msj_articulo: '',
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.grupo_usuario = me.usuario.id_group;
        me.getPublicaciones();
    },
    methods: {
        getPublicaciones() {
            let me = this;
            me.mod_articulos = false;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'articulos')
                .then(function (res) {
                    me.publicaciones = res.data;
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        crearPublicacion() {
            let me = this;
            me.edita = false;
            me.btn_color = 'success'
            me.btn_texto = 'Guardar'
            me.titleModal = "Agregar artículo";
            me.msj_articulo = 'Articulo agregado correctamente';
            me.id = '';
            me.nombre = '';
            me.descripcion = '';
            me.asignaturaSelect = {
                'id': '',
                'nombre': ''
            };
            me.file = "";
            me.filep = "";
            me.portada = '';
            me.archivo = '';
            me.mod_articulos = true;

        },
        handleFileUpload() {
            let me = this;
            me.porcentaje = 0;
            me.pesoArchivo = 0;
            me.muyPesado = false;
            me.file = me.$refs.file.files[0];
            // verificar tamaño de archivo
            // console.log(me.file)
            me.pesoArchivo = (me.file.size / me.bytes).toFixed(2);
            if (me.pesoArchivo > me.limiteMegas) {
                me.muyPesado = true;
            }
        },
        portadaUpload() {
            let me = this;
            me.porcentajep = 0;
            me.pesoArchivop = 0;
            me.muyPesadop = false;
            me.filep = me.$refs.filep.files[0];
            // verificar tamaño de archivo
            // console.log(me.filep)
            me.pesoArchivop = (me.filep.size / me.bytes).toFixed(2);
            if (me.pesoArchivop > me.limitePortada) {
                me.muyPesadop = true;
            }
        },
        subirArchivo() {
            let me = this;
            if (me.nombre == "") {
                me.$vs.notify({
                    text: 'Ingrese el nombre del artículo',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.descripcion == "") {
                me.$vs.notify({
                    text: 'Ingrese la descripción del artículo',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.asignaturaSelect.nombre == "") {
                me.$vs.notify({
                    text: 'Seleccione el área',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.muyPesado) {
                me.$vs.notify({
                    text: 'El archivo a subir excede el peso permitido, verifique antes de continuar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.muyPesadop) {
                me.$vs.notify({
                    text: 'La portada a subir excede el peso permitido, verifique antes de continuar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.archivo == "" && me.file == "") {
                me.$vs.notify({
                    text: 'Seleccione el archivo ',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            if (me.portada == "" && me.filep === "") {
                me.$vs.notify({
                    text: 'Seleccione una portada',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let estado1 = me.estado ? 1 : 0;
            let dataA = new FormData();
            if (me.file != '') {
                dataA.append('archivo', me.file);
            }
            if (me.filep != '') {
                dataA.append('portada', me.filep);
            }
            dataA.append('id', me.id);
            dataA.append('nombre', me.nombre);
            dataA.append('descripcion', me.descripcion);
            dataA.append('idusuario', me.usuario.idusuario);
            dataA.append('idarea', me.asignaturaSelect.id);
            dataA.append('area', me.asignaturaSelect.nombre);
            dataA.append('estado', estado1);
            dataA.append('replace_archivo', me.replace_archivo);
            dataA.append('replace_portada', me.replace_portada);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            axios.post(this.$data_url + 'api/save_posts', dataA, config)
                .then(res => {
                    // console.log(res.data)
                    me.getPublicaciones();
                    me.$vs.notify({
                        text: me.msj_articulo,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        },
        f_zoom_img(item) {
            let me = this;
            me.datos_imagen = item;
            // console.log(item)
            me.modal_imagen = true;
        },
        editaArticulo(item) {
            let me = this;
            console.log(item)
            me.edita = true;
            me.btn_color = 'warning'
            me.btn_texto = 'Editar'
            me.titleModal = "Editar artículo";
            me.msj_articulo = 'Articulo editado correctamente';
            me.id = item.id;
            me.nombre = item.nombre;
            me.descripcion = item.descripcion;
            me.asignaturaSelect.id = item.idarea;
            me.asignaturaSelect.nombre = item.area;
            me.file = '';
            me.filep = '';
            me.portada = item.nombre_portada;
            me.archivo = item.nombre_archivo;
            me.estado = item.estado == 1 ? true : false;
            me.mod_articulos = true;
        },
        quitarArchivo(item, data) {
            let me = this;
            // console.log(item, data)
            if (item == 1) {
                me.archivo = "";
                me.file = "";
                me.replace_archivo = data;
            }
            if (item == 2) {
                me.portada = "";
                me.filep = "";
                me.replace_portada = data;
            }
        },
        verArticulo(web) {
            let a1 = web.nombre_archivo.indexOf(".");
            let b1 = web.nombre_archivo.substr(a1 + 1)
            if (b1 == "doc" || b1 == "docx" || b1 == "xls" || b1 == "xlsx") {
                window.open('https://view.officeapps.live.com/op/embed.aspx?src=' + this.$data_url + web.ruta_archivo + '/' + web.nombre_archivo, '_blank');
                return
            }
            if (b1 == "pdf") {
                window.open('https://docs.google.com/viewer?url=' + this.$data_url + web.ruta_archivo + '/' + web.nombre_archivo, '_blank');
                return
            }
            me.$vs.notify({
                text: 'No es posible mostrar una vista previa del archivo solicitado, por favor descarguelo',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            })
        },
        openConfirmEliminar(item) {
            let me = this;
            me.elimita_contenido_articulo = item
            console.log(item)
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este artículo?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarArticulos
            })
        },
        eliminarArticulos() {
            let me = this;
            //eliminar archivo
            let dataA = new FormData();
            dataA.append('id', me.elimita_contenido_articulo.id);
            dataA.append('archivo', me.elimita_contenido_articulo.nombre_archivo);
            dataA.append('portada', me.elimita_contenido_articulo.nombre_portada);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post(this.$data_url + 'api/delete_posts', dataA, config)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.notify({
                        text: res.data,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getPublicaciones();
                })
                .catch(error => {
                    console.log(error)
                })
        },
        verArticulos() {
            let me = this
            if (me.grupo_usuario == 6) {
                me.$router.push('/vpublicaciones');
            }
            if (me.grupo_usuario == 1) {
                me.$router.push('/verArticulosAdmin');
            }
        },
    }
}
</script>

<style lang="css">
.borde-unidad {
    border: 1px dashed #ccc;
    /* display: inline-block; */
    padding: 6px;
    cursor: pointer;
}
</style>
