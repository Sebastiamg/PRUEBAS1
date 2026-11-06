<template>
<div>
    <vx-card>
        <vs-button icon="add" color="primary" type="border" @click="f_agregar()">Agregar</vs-button>
        <vs-table max-items="20" search pagination :data="listaVarios">
            <template slot="header">
                <span>Cantidad: </span>
            </template>
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>titulo</vs-th>
                <vs-th>descripcion</vs-th>
                <vs-th>image</vs-th>
                <vs-th>creado</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{tr.id}}<br>
                    </vs-td>
                    <vs-td>
                        {{tr.titulo}}<br />
                        <vs-chip color="danger" v-if="tr.estado == 0">Inactivo</vs-chip>
                        <vs-chip v-if="tr.estado == 1">Activo</vs-chip>
                    </vs-td>
                    <vs-td>
                        <b>Descripción:</b>
                        <p>{{tr.descripcion}}</p>
                        <b>Orden:</b>
                        <p>{{ tr.orden }}</p>
                    </vs-td>
                    <vs-td>
                        {{tr.image}}<br />
                        <img width="100" class="img-responsive" :src="$data_url+'archivos/files_varios_libre/'+tr.imagen"> <br/>
                        <b>Url:</b>
                        {{tr.url}}
                    </vs-td>

                    <vs-td>
                        {{tr.created_at}}
                    </vs-td>
                    <vs-td>
                        <div class="flex">
                            <vs-button icon="edit" color="warning" type="border" @click="f_agregar(tr)"></vs-button>
                            <vs-button icon="delete" class="ml-2" color="danger" type="border" @click="f_confirma_eliminar(tr)"></vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>

    <vs-popup :title="titulo_modal" :active.sync="popupAdd">
        <div class="row">
            <div class="col-12 m-3">
                <vs-input class="w-full" v-model="datos.titulo" label="Titulo"></vs-input>
            </div>
            <div class="col-12 m-3">
                <vs-input class="w-full" v-model="datos.descripcion" label="Descripcion"></vs-input>
            </div>
            <div class="col-12 m-3">
                <input type='file' id="file" class="w-full" icon-pack="feather" icon="icon-image" icon-no-border @change="obtenerImagen" accept="image/png, image/gif, image/jpeg, image/gif, image/jpg" />
                <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                <p class="text-danger"> {{msj}} </p>
                <div class="mt-3" v-if="datos.imagen">
                    <p>Imagen Actual:</p>
                    <img width="100" class="img-responsive" :src="$data_url+'archivos/files_varios_libre/'+datos.imagen">
                </div>
            </div>
            <div class="col-12 m-3">
                <vs-input class="w-full" type="number" v-model="datos.orden" label="Orden"></vs-input>
            </div>
            <div class="col-12 m-3">
                <vs-input class="w-full" v-model="datos.url" label="Url externo"></vs-input>
            </div>
            <div class="col-12 m-3">
                <vs-radio class="m-3" v-model="datos.estado" color="danger" vs-name="radio1" vs-value="0">Inactivo</vs-radio>
                <vs-radio class="m-3" v-model="datos.estado" vs-name="radio1" vs-value="1">Activo</vs-radio>
            </div>
            <div class="col-12 m-3">
                <vs-button :icon="ico_btn" :color="color_btn" type="border" @click="f_guardar()"> {{ txt_btn }} </vs-button>
            </div>
        </div>
    </vs-popup>
</div>
</template>

<script>

import vSelect from 'vue-select';
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            listaVarios: [],
            popupAdd: false,
            datos: {},
            titulo_modal: '',
            txt_btn: '',
            ico_btn: '',
            color_btn: '',
            datoEliminar: '',
            bytes: 1048576,
            limiteMegas: 1,
            porcentaje: '',
            pesoArchivo: '',
            muyPesado: '',
            msj: '',
            img_old:'',
        }
    },
    mounted() {
        let me = this;
        me.f_getvarios();
    },
    methods: {
        f_getvarios() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'f_todoVarios')
                .then((result) => {
                    console.log(result.data)
                    me.listaVarios = result.data
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        f_agregar(item) {
            let me = this;
            me.msj = ""
            document.getElementById("file").value = ""
            if(item == undefined){
            }else{
                me.img_old = item.imagen
            }
            me.datos = {
                'id':0,
                'titulo': '',
                'descripcion': '',
                'url': '',
                'imagen': '',
                'estado': 1,
                'orden':''
            }
            me.titulo_modal = 'Agregar'
            me.txt_btn = 'Agregar'
            me.ico_btn = 'save'
            me.color_btn = 'primary'
            if (item != null) {
                me.titulo_modal = 'Editar'
                me.txt_btn = 'Editar'
                me.ico_btn = 'edit'
                me.color_btn = 'warning'
                me.datos = {
                    'id': item.id,
                    'titulo': item.titulo,
                    'descripcion': item.descripcion,
                    'url': item.url,
                    'imagen': item.imagen,
                    'estado': item.estado,
                    'orden':item.orden
                }
            }
            me.popupAdd = true;
        },
        obtenerImagen(e) {
            let me = this;
            me.file = e.target.files[0];
            // console.log(me.file)
            me.muyPesado = false;
            me.pesoArchivo = (me.file.size / me.bytes).toFixed(2);
            if (me.pesoArchivo > me.limiteMegas) {
                me.muyPesado = true;
                me.msj = 'El archivo que intenta subir, pesa ' + me.pesoArchivo + ' mb. y excede el peso permitido, favor verifique';
            }
        },
        f_guardar() {
            let me = this;
            if (me.datos.titulo == '') {
                me.msj = 'Ingrese el titulo'
                me.f_notificaciones(me.msj, 'danger', 'icon-alert-triangle')
                return
            }
            if (me.datos.descripcion == '') {
                me.msj = 'Ingrese la descripcion'
                me.f_notificaciones(me.msj, 'danger', 'icon-alert-triangle')
                return
            }
            // if (me.datos.imagen == '') {
            //     me.msj = 'Ingrese la url'
            //     me.f_notificaciones(me.msj, 'danger', 'icon-alert-triangle')
            //     return
            // }
            if (me.datos.url == '') {
                me.msj = 'Ingrese la url'
                me.f_notificaciones(me.msj, 'danger', 'icon-alert-triangle')
                return
            }
            // me.datos.imagen = me.file;
            let imagen = document.getElementById("file").files[0];
            console.log(me.datos)
            let formData = new FormData();
            formData.append('id',               me.datos.id)
            formData.append('descripcion',      me.datos.descripcion)
            formData.append('estado',           me.datos.estado)
            formData.append('orden',            me.datos.orden)
            formData.append('imagen',           imagen)
            formData.append('titulo',           me.datos.titulo)
            formData.append('url',              me.datos.url)
            formData.append('img_opcion_old',   me.img_old)
            me.$vs.loading();
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            // this.$http.post(this.$server_url + 'f_guardarVarios', me.datos)
            this.$http.post(this.$data_url + 'api/f_guardarVarios', formData,config)
                .then((result) => {
                    console.log(result.data)
                    me.f_getvarios();
                    me.popupAdd = false;
                    me.$vs.loading.close();
                }).catch((err) => {
                    me.popupAdd = false;
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        f_confirma_eliminar(item) {
            let me = this;
            me.datoEliminar = item;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro de eliminar este archivo?',
                accept: this.eliminar_archivo
            })
        },
        eliminar_archivo() {
            let me = this;
            me.$vs.loading();
            this.$http.post(this.$data_url + 'api/f_deleteVarios', me.datoEliminar)
            // this.$http.post(this.$server_url + 'f_deleteVarios', me.datoEliminar)
                .then((result) => {
                    console.log(result.data)
                    me.msj = 'Registro eliminado correctamente'
                    me.f_notificaciones(me.msj, 'primary', 'icon-check')
                    me.f_getvarios();
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        f_notificaciones(msj, color, icono) {
            let me = this;
            me.$vs.notify({
                text: msj,
                color: color,
                iconPack: 'feather',
                icon: icono
            })
            return;
        }
    },
}
</script>
