<template>
    <div>
        <vs-card v-if="permisoRoot == true">
            <div class="header">
                <small  v-if="usuario.id_group == 1" align="left">Ruta: /u_usuarios/perfiles</small>
                <vs-button color="primary" type="line" @click="popupAgregar = true;update = false;limpiar();" icon-pack="feather" icon="icon-file-plus" style="border-radius: 5px;margin-top:20px;margin-left: 10px;">
                    Agregar
                </vs-button>
            </div>
            <div v-if="perfiles.length >0 ">
                <vs-table max-items="10" search pagination :data="perfiles">
                    <template slot="header">
                        <vs-chip color="primary" class="ml-2">Cantidad {{ perfiles.length }}</vs-chip>
                    </template>
                    <template slot="thead">
                        <vs-th>#</vs-th>
                        <vs-th>Descripción</vs-th>
                        <vs-th>level</vs-th>
                        <vs-th >Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].id}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].deskripsi}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].level}}<br>
                            </vs-td>
                            <vs-td>
                                <div style="display: flex;">
                                    <vx-tooltip style="display: inline-block;" text="Editar Perfil" position="top" color="primary">
                                        <vs-button color="success" type="line"  @click="openModalEditar(tr);update=true;" style="border-radius: 20px;" icon-pack="feather" icon="icon-edit">
                                    </vs-button>
                                    </vx-tooltip> &nbsp;
                                    <vx-tooltip style="display: inline-block;" text="Eliminar Perfil" position="top" color="warning">
                                        <vs-button color="danger" type="line" @click="openConfirm(tr)" style="border-radius: 20px;" icon-pack="feather" icon="icon-x-square">
                                        </vs-button>
                                    </vx-tooltip>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <div v-else class="p-3">
                <p> No existe perfiles aun. </p>
            </div>
        </vs-card>
        <!--MODALES-->
        <!--MODAL PARA AGREGAR-->
        <vs-popup
            style="color:#000;"
            title="Agregar perfil" :active.sync="popupAgregar">
                <vs-row >
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <vs-input icon-after="true" style="width: 100%;" label-placeholder="Descripción" icon="mode_edit" placeholder="Descripción" v-model="perfil.descripcion"/>
                    </vs-col>
                </vs-row>
                <vs-row style="margin-top:10px;">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <vs-input icon-after="true" style="width: 100%;" label-placeholder="Level" icon="mode_edit" placeholder="Level" v-model="perfil.level"/>
                    </vs-col>
                </vs-row>
                <vs-row style="margin-top:20px;">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                       <vs-button type="relief" @click="agregarPerfil()">Guardar</vs-button>
                    </vs-col>
                </vs-row>
        </vs-popup>
        <!--FIN MODAL AGREGAR-->
        <!--MODAL PARA EDITAR-->
        <vs-popup
            style="color:#000;"
            title="Agregar perfil" :active.sync="popupEditar">
                <vs-row >
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <vs-input icon-after="true" style="width: 100%;" label-placeholder="Descripción" icon="mode_edit" placeholder="Descripción" v-model="perfil.descripcion"/>
                    </vs-col>
                </vs-row>
                <vs-row style="margin-top:10px;">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <vs-input icon-after="true"  style="width: 100%;" label-placeholder="Level" icon="mode_edit" placeholder="Level" v-model="perfil.level"/>
                    </vs-col>
                </vs-row>
                <vs-row style="margin-top:20px;">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                       <vs-button type="relief" @click="agregarPerfil()">Guardar</vs-button>
                    </vs-col>
                </vs-row>
        </vs-popup>
        <!--FIN MODAL EDITAR-->
    </div>
</template>
<script>
export default {
    data() {
        return{
           usuario:[],
           perfiles:[],
           popupAgregar:false,
           popupEditar:false,
           perfil:{
               level:'',
               descripcion:'',
           },
           update:false,
           id:0,
           permisoRoot:false,
        }
    },

    created(){
        let me = this;
        me.getPerfiles();
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
        me.getUserRoot()
    },
    methods:{
        //para obtener el listado de los usuarios root
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
        //para obtener  los perfiles
        getPerfiles() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'obtenerPerfiles')
                .then(function (res) {
                    me.perfiles = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        openModalEditar(tr){
            let me = this;
            me.popupEditar = true;
            me.id = tr.id
            me.perfil.level = tr.level
            me.perfil.descripcion = tr.deskripsi
        },
        openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'warning',
                title: `Confirm`,
                text: 'Estás seguro de eliminar el perfil?',
                acceptText:'Si, deseo eliminar',
                CancelText:'Cancelar',
                accept:this.eliminarPerfil
            })
        },
        eliminarPerfil(){
            let me = this;
            let formData = new FormData();
            formData.append('id',  me.id);

            this.$http.post(this.$server_url+'eliminarPerfil', formData)
                .then(function (res) {

                    if(res.data.message){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time:8000
                    })
                    }

                    me.getPerfiles()
                    me.limpiar()

                })
                .catch(function (error) {})
        },

        agregarPerfil(){
            let me = this;

                if(me.perfil.descripcion.trim() === '' || me.perfil.descripcion.trim() === null || me.perfil.descripcion.trim() === undefined ){
                    this.$vs.notify({
                        text:'El campo no debe estar vacio',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }


            let formData = new FormData();
            if(me.update){
                formData.append('id',     me.id);
                formData.append('level', me.perfil.level);
                formData.append('deskripsi', me.perfil.descripcion);
            }else{
                formData.append('level', me.perfil.level);
                formData.append('deskripsi', me.perfil.descripcion);
            }

            me.$vs.loading();

            this.$http.post(this.$server_url+'guardarPerfil', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getPerfiles()
                    me.popupAgregar=false;
                    me.popupEditar =false;
                    me.update = false;
                    me.limpiar()

                })
                .catch(function (error) {
                   me.$vs.loading.close()
                    console.log(error)

                })

        },
        limpiar(){
            let me = this;
            me.id = 0
            me.perfil.level = "";
            me.perfil.descripcion = "";

        }

    }
}
</script>
