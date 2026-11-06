<template>
    <vx-card fixed-height="true">
    <!-- <pre>{{ Clientes }}</pre> -->
        <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo</vs-button>
        <vs-table max-items="10" pagination search :data="Clientes">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ Clientes.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th>
                    Id
                </vs-th>
                <vs-th>
                    Nombre
                </vs-th>
                <vs-th>
                    Apellido
                </vs-th>
                <vs-th>
                    Edad
                </vs-th>
                <vs-th>
                    Email
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].id">
                        {{ data[indextr].id }}
                    </vs-td>
                    <vs-td :data="data[indextr].nombre">
                        {{ data[indextr].nombre }}
                    </vs-td>
                    <vs-td :data="data[indextr].apellido">
                        {{ data[indextr].apellido }}
                    </vs-td>
                    <vs-td :data="data[indextr].edad">
                        {{ data[indextr].edad }}
                    </vs-td>
                    <vs-td :data="data[indextr].correoElectronico">
                        {{ data[indextr].correoElectronico }}
                    </vs-td>
                    <vs-td :data="data[indextr].id">
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2 inline" color="success" @click="getEditar(tr)"></vs-button>
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="crear" title="Registro nuevo cliente" :active.sync="popupActivoGuardar">
            <vs-row>
                {{ tabPrueba }}
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Prueba</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombres *" placeholder="Nombres" class="w-full" icon="mode_edit" v-model="tabPrueba.nombre" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Apellidos *" placeholder="Apellidos" class="w-full" icon="mode_edit" v-model="tabPrueba.apellido" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Edad *" placeholder="Edad" class="w-full" icon="mode_edit" v-model="tabPrueba.edad" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Email *" placeholder="Email" class="w-full" icon="mode_edit" v-model="tabPrueba.correoElectronico" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="editar" title="Edición cliente" :active.sync="popupActivoEditar">
            <vs-row>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Prueba</b></vs-col>
                {{ tabPrueba }}
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Cédula *" placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabPrueba.nombre" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Apellidos *" placeholder="Apellidos" class="w-full" icon="mode_edit" v-model="tabPrueba.apellido" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombres *" placeholder="Nombres" class="w-full" icon="mode_edit" v-model="tabPrueba.edad" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Dirección *" placeholder="Dirección" class="w-full" icon="mode_edit" v-model="tabPrueba.correoElectronico" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="eliminar" title="¿Confirma que desea eliminar el registro?" :active.sync="popupActivoEliminar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    </vx-card>
    </template>
<script>
import Vue from 'vue'
import axios from 'axios'
export default {
    data() {
        return{
            
            Clientes: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoEliminar: false,
            tabPrueba: {
                id: '',
                nombre: '',
                apellido: '',
                edad: '',
                correoElectronico: ''
            },
            id: 0,
        }
    },
    mounted() {
        let me = this
        this.getCliente();
        // let cal = new Object 
        // cal.id = 27
        // cal.nombre = "44"
        // cal.apellido = "44"
        // cal.edad = "44"
        // cal.correoElectronico = "44"
        // me.Clientes.push(cal)
        // console.log("mea",me.Clientes)
    },
    methods: {
        getCliente() {
            let me = this;
            // axios.get(this.$apifacturacion_url + 'f_Pruebaapi')
            this.$http.get(this.$server_url+'Pruebaapi')
            .then(res => {
            let resultado = res.data.filter(c => c.nombre !== 0);
            this.Clientes = resultado;
            })
            .catch(err => {
            console.log(err)
            })
        },
        // getCliente() {
        // axios.get('https://localhost:7252/api/Cliente')
        //     .then(res => {
        //     let resultado = res.data.filter(c => c.cliCi !== null && c.cliCi !== '');
        //     this.Clientes = resultado;
        //     console.log(this.Clientes);
        //     })
        //     .catch(err => {
        //     console.log(err);
        //     });
        // },
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabPrueba.id = ''
            this.tabPrueba.nombre = ''
            this.tabPrueba.apellido = ''
            this.tabPrueba.edad = ''
            this.tabPrueba.correoElectronico = ''
        },
        guardarnuevo() {
        let me = this;
            if (this.tabPrueba.nombre === '' || this.tabPrueba.nombre === null) {
                me.$vs.notify({
                    text: 'Escriba un nombre antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabPrueba.edad === '' || this.tabPrueba.edad === null) {
                me.$vs.notify({
                    text: 'Escriba la Edad antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            // let formData = new FormData();
            // formData.append('nombre', this.tabPrueba.nombre)
            // formData.append('nombre', this.tabPrueba.nombre)
            // formData.append('apellido', this.tabPrueba.apellido)
            // formData.append('edad', this.tabPrueba.edad)
            // formData.append('correoElectronico', this.tabPrueba.correoElectronico)
            // const config = {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json' 
            //     };
        let datos  = {
                "nombre": this.tabPrueba.nombre,
                "apellido": this.tabPrueba.apellido,
                "edad": this.tabPrueba.edad,
                "correoElectronico": this.tabPrueba.correoElectronico
            }
        me.$vs.loading()
        // axios.post(this.$apifacturacion_url + 'f_Pruebaapi', datos)
        this.$http.post(this.$server_url+'Pruebaapi_post', datos)
        // axios.post('https://localhost:44320/api/f_Pruebaapi', datos)
            .then(res => {
                this.getCliente();
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Prueba guardado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Prueba no se pudo guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getEditar(tr) {
        this.popupActivoEditar = true
        this.tabPrueba.id = tr.id
        this.tabPrueba.nombre = tr.nombre
        this.tabPrueba.apellido = tr.apellido
        this.tabPrueba.edad = tr.edad
        this.tabPrueba.correoElectronico = tr.correoElectronico
        // this.$router.push('/prueba/editar/' + this.id);
        // console.log(id);
        // this.$params.id;
        },
        editar() {
        let me = this;
        let datos  = {
                "id": this.tabPrueba.id,
                "nombre": this.tabPrueba.nombre,
                "apellido": this.tabPrueba.apellido,
                "edad": this.tabPrueba.edad,
                "correoElectronico": this.tabPrueba.correoElectronico
            }
        me.$vs.loading()
        // axios.post('https://localhost:44320/api/f_Pruebaapi', datos)
        this.$http.post(this.$server_url+'Pruebaapi_put', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getCliente();
                me.$vs.notify({
                    text: 'Prueba editado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Prueba no se pudo editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getPreguntaEliminar(tr) {
            this.tabPrueba.id = tr.id
            this.popupActivoEliminar = true
            //console.log(this.caf_id);
        },
        getEliminar() {
            let me = this;
            me.$vs.loading()
            // axios.post(this.$apifacturacion_url + 'f_Pruebaapi/DeletePruebaapi?id=' + this.tabPrueba.id )
            this.$http.post(this.$server_url+'Prueba_api_delete?id=' + this.tabPrueba.id)
            .then(data => {
                me.$vs.loading.close()
                this.getCliente();
                me.$vs.notify({
                    text: 'Prueba eliminado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Prueba no se pudo eliminar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getCancelar() {
            this.popupActivoEditar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
        },
    },
    // created(){
    //     let url = "https://localhost:7252/api/Cliente";
    //     axios.get(url).then((response) => this.Clientes = response.data);
    //     // fetch("https://localhost:7252/api/Cliente/")
    //     // .then(response => response.json())
    //     // .then((data) => (this.Clientes = data));
    //     // // .then(data => (this.totalVuePackages = data.total));
    // }
}
</script>