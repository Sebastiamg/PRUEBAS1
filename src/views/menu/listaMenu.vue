<template>
<div class="vx-col md:w-full w-full mb-base">

    <vs-popup :title="titulo" :active.sync="modalMenu">
        <div class="vx-row mt-4">
            <div class="vx-col  w-full" align="left">
                <div style="font-size: 12px; ">Grupo/perfil: </div>
                <v-select class="mb-4 w-full" v-model="grupoSelect" :options="grupos" label="deskripsi" :reduce="grupos => grupos" placeholder="Seleccione..." />
            </div>
            <div class="vx-col  w-full" align="left">
                <div style="font-size: 12px; ">Nombre: </div>
                <!-- <vs-input type="text" class="inputx w-full mb-4" v-model="menu.idmenu" maxlength="100"  /> -->
                <vs-input type="text" class="inputx w-full mb-4" v-model="menu.name" maxlength="100" placeholder="Nombre del menú" />
            </div>
            <div class="vx-col  w-full" align="left">
                <div style="font-size: 12px; ">Url: </div>
                <vs-input type="text" class="inputx w-full mb-4" v-model="menu.url" maxlength="100" placeholder="Ruta del menú" />
            </div>
            <div class="vx-col  w-full" align="left">
                <div style="font-size: 12px; ">Icono: </div>
                <vs-input type="text" class="inputx w-full mb-4" v-model="menu.icon" maxlength="100" placeholder="ActivityIcon" />
            </div>
            <div class="vx-col  w-full" align="left">
                <div style="font-size: 12px; ">Orden: </div>
                <vs-input type="number" min="0" max="100" class="inputx w-full mb-4" v-model="menu.orden" maxlength="100" placeholder="Orden del menú" />
            </div>
            <div class="vx-col w-full mt-4">
                <vs-button icon-pack="feather" icon="icon-plus" class="mr-2" :color="color_boton" @click="agregar_editar()">{{txt_boton}}</vs-button>
            </div>
        </div>
    </vs-popup>

    <vx-card>
        <vs-table max-items="20" search pagination :data="listaMenu" style="margin-top:-20px">
            <template slot="header">
                <div class="vx-row">
                    <div class="vx-col w-full mt-4">
                        <vs-button icon-pack="feather" icon="icon-plus" class="mr-2" color="primary" @click="agregarModal()">Agregar menú</vs-button>
                    </div>
                    <div class="vx-col w-full mt-4" align="left">
                        <v-select class="mb-4 w-full" v-model="grupoSelect1" :options="grupos" label="deskripsi" @input="datosPerfiles" placeholder="Seleccione..." />
                    </div>
                    <div class="vx-col w-full">
                        Cantidad: {{listaMenu.length}}
                    </div>
                </div>
            </template>
            <template slot="thead">
                <vs-th sort-key="nombre">Nombre</vs-th>
                <vs-th sort-key="url">Url</vs-th>
                <vs-th sort-key="icon">Icono</vs-th>
                <vs-th sort-key="orden">Orden</vs-th>
                <vs-th sort-key="grupo">Grupo</vs-th>
                <vs-th sort-key="created_at">Fechas</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].name}}
                    </vs-td>
                    <vs-td>
                        <b class="cursor-pointer text-primary" @click="verLink(tr)" style="text-decoration: underline;">{{data[indextr].url}}</b>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].icon}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].orden}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].grupo}}
                    </vs-td>
                    <vs-td>
                        <small>Creado: {{data[indextr].created_at}} <br>
                            Actualizado: {{data[indextr].updated_at}}</small>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip style="display: inline-block;" text="editar" position="top" color="warning">
                            <vs-button size="small" icon-pack="feather" icon="icon-edit" class="mr-2" color="warning" @click="editarModal(tr)"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="eliminar" position="top" color="danger">
                            <vs-button size="small" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="confirmaEliminar(tr)"></vs-button>
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
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            listaMenu: '',
            tmpListaMenu: '',
            modalMenu: false,
            titulo: '',
            opciones: 0,
            menu: {
                'idmenu': '',
                'name': '',
                'url': '',
                'icon': '',
                'orden': '',
            },
            grupos: [],
            grupoSelect: {},
            grupoSelect1: {},
            txt_boton: '',
            color_boton: '',
            usuario: '',
            id_autorizado: '',
            mensaje: 'Hey !!!! ¿Qué quiere hacer?, este contenido es restringido, consulte con los encargados del desarrollo.',
            permisoRoot:false,
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
        me.id_autorizado = me.usuario.idusuario;
        me.getUserRoot()
        me.getMenu();
    },
    methods: {
      getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url+'permisos?permiso=yes&usuario_id='+me.usuario.idusuario)
                .then(function (res) {
                    if(res.data.status == '1'){
                        me.permisoRoot = true
                    }else{
                        me.permisoRoot = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        verLink(tr){
            let me = this;
            window.open(tr.url)
        },
        getMenu() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'listaMenu')
                .then(res => {
                    me.tmpListaMenu = res.data;
                    me.perfiles();
                    me.$vs.loading.close();
                })
                .catch(err => {
                    // console.log(err)
                    me.$vs.loading.close();
                })
            this.$http.get(this.$server_url + 'grupos_users')
                .then(res => {
                    me.grupos = res.data
                })
        },
        agregarModal() {
            let me = this;
            me.modalMenu = true;
            me.titulo = 'Agregar menú';
            me.txt_boton = 'Registrar';
            me.color_boton = 'success';
            me.menu = {
                'idmenu': '',
                'name': '',
                'url': '',
                'icon': '',
                'orden': '',
            }
            me.grupoSelect = {}
        },
        editarModal(item) {
            let me = this;
            me.modalMenu = true;
            // console.log(item)
            me.menu = item;
            me.grupoSelect = {}
            me.grupoSelect.id = item.sys_group_users_id
            me.grupoSelect.level = item.grupo
            me.grupoSelect.deskripsi = item.descripcion
            me.txt_boton = 'Editar';
            me.titulo = 'Editar menú';
            me.color_boton = 'warning';

        },
        agregar_editar() {
            let me = this;
            // console.log(me.menu, me.grupoSelect.id)
            // return
            me.modalMenu = false;
            if (me.permisoRoot) {
                let datos = new FormData();
                datos.append('idmenu', me.menu.idmenu)
                datos.append('orden', me.menu.orden)
                datos.append('url', me.menu.url)
                datos.append('nombre', me.menu.name)
                datos.append('icono', me.menu.icon)
                datos.append('grupo', me.grupoSelect.id)
                this.$http.post(this.$server_url + 'add_editMenu', datos)
                    .then(res => {
                        // console.log(res.data)
                        me.$vs.notify({
                            text: 'Contenido agregado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getMenu();
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                me.$vs.notify({
                    text: me.mensaje,
                    time: 10000,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

        },
        datosPerfiles() {
            let me = this;
            me.listaMenu = [];
            if (me.grupoSelect1.id == 0) {
                me.listaMenu = me.tmpListaMenu;
            } else {
                for (let index = 0; index < me.tmpListaMenu.length; index++) {
                    if (me.tmpListaMenu[index].sys_group_users_id == me.grupoSelect1.id) {
                        me.listaMenu.push(me.tmpListaMenu[index]);
                    }
                }
            }
        },
        confirmaEliminar(item) {
            let me = this;
            me.id_eliminar = item.idmenu;
            if (me.permisoRoot) {
                me.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: 'Confirmar',
                    text: 'Seguro desea eliminar este item?',
                    acceptText: 'Aceptar',
                    cancelText: 'Cancelar',
                    accept: me.eliminarMenu
                })
            } else {
                me.$vs.notify({
                    text: me.mensaje,
                    time: 10000,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
        },
        eliminarMenu() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'eliminarMenu/' + me.id_eliminar)
                .then(res => {
                    me.$vs.notify({
                        text: 'Item eliminado correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close();
                    me.getMenu();
                })
                .catch(er => {
                    me.$vs.loading.close();
                })
        }
    }
}
</script>
