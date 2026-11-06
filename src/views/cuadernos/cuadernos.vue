<template>
    <div>
        <div v-if="cuadernos.length >0 ">
            <vs-button color="dark" v-if="permisoRoot" class="mt-2" @click="limpiar();popupAddCuaderno=true;" type="filled">Crear Cuaderno</vs-button>
            <vs-table max-items="10" search pagination :data="cuadernos">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ cuadernos.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Cuaderno</vs-th>
                    <vs-th>Web Cuaderno</vs-th>
                    <vs-th>Asignatura</vs-th>
                    <vs-th>Pdfs</vs-th>
                    <vs-th>Portada</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombrecuaderno}}<br>
                            <p style="font-size:11px;"> Descrip. {{data[indextr].descripcioncuaderno}}</p>
                        </vs-td>
                        <vs-td>
                             {{data[indextr].webcuaderno}}<br>
                             <p style="font-size:11px;"> zip. {{data[indextr].zipcuaderno}}</p>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].nombreasignatura}}<br>
                        </vs-td>
                        <vs-td>
                            <span @click="datopdfsinguia(data[indextr])"  >
                                SG: <p style="cursor:pointer;color:coral; text-decoration: underline;">{{data[indextr].pdfsinguia}}</p>
                            </span>
                            <span @click="datopdfconguia(data[indextr])">
                                G: <p style="cursor:pointer;color:coral; text-decoration: underline;">{{data[indextr].pdfconguia}}</p>
                            </span>
                             <span  @click="datopdfguiadidactica(data[indextr])">
                                G. Didactica: <p style="cursor:pointer;color:coral; text-decoration: underline;">{{data[indextr].guiadidactica}}</p>
                            </span>
                        </vs-td>
                        <vs-td>
                            <a style="cursor:pointer;" >
                                <img v-if="data[indextr].weblibro != null "  class="responsive card-img-top image"  v-bind:src="$data_url+'archivos/upload/cuadernodigital/'+data[indextr].webcuaderno+'/portada.jpg'" alt="Card image cap">
                                <img v-else class="responsive card-img-top image" v-bind:src="$data_url+'archivos/upload/cuadernodigital/'+data[indextr].webcuaderno+'/portada.jpg'" width="50" alt="Card image cap">
                            </a>
                        </vs-td>
                        <vs-td style="display:flex;">
                            <vx-tooltip style="display: inline-block;" text="Editar cuaderno" position="top" color="primary">
                                <vs-button class="modal-default-button" size="small"  color="success" @click="update=true;openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                            </vx-tooltip> &nbsp;
                            <vx-tooltip style="display: inline-block;"   text="Eliminar cuaderno" position="top" color="primary">
                                <vs-button class="modal-default-button" size="small" color="danger" @click="openConfirm(data[indextr].idcuaderno)" type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                            </vx-tooltip> &nbsp;
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else class="p-3">
            <p> No existe areas aun. </p>
        </div>
        <!--PARA LOS MODALES -->
        <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Cuaderno" :active.sync="popupAddCuaderno">
                <vs-input class="inputx mb-3 w-full" label="Nombre Cuaderno" v-model="cuaderno.nombrecuaderno" />
                <vs-input class="inputx mb-3 w-full" label="Descripcion Cuaderno" v-model="cuaderno.descripcioncuaderno" />
                <vs-input class="inputx mb-3 w-full" label="Web Cuaderno" v-model="cuaderno.webcuaderno" />
                <vs-input class="inputx mb-3 w-full" label="Exe Cuaderno" v-model="cuaderno.execuaderno" />
                <vs-input class="inputx mb-3 w-full" label="Pdf con guia" v-model="cuaderno.pdfconguia" />
                <vs-input class="inputx mb-3 w-full" label="Pdf sin guia" v-model="cuaderno.pdfsinguia" />
                <vs-input class="inputx mb-3 w-full" label="Guia didactica" v-model="cuaderno.guiadidactica" />
                <vs-input class="inputx mb-3 w-full" label="Zip Cuaderno" v-model="cuaderno.zipcuaderno" />
                Asignatura
                <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="nombreasignatura" class="w-full" v-model="cuaderno.asignatura" />
                 <br><br>
                <vs-button color="success" class="w-full mb-3" @click="guardarCuaderno()" type="gradient" >Guardar</vs-button>
            </vs-popup>
        </div>
        <!-- Modal Editar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Editar Area" :active.sync="popupEditCuaderno">
              <vs-input class="inputx mb-3 w-full" label="Nombre Cuaderno" v-model="cuaderno.nombrecuaderno" />
                <vs-input class="inputx mb-3 w-full" label="Descripcion Cuaderno" v-model="cuaderno.descripcioncuaderno" />
                <vs-input class="inputx mb-3 w-full" label="Web Cuaderno" v-model="cuaderno.webcuaderno" />
                <vs-input class="inputx mb-3 w-full" label="Exe Cuaderno" v-model="cuaderno.execuaderno" />
                <vs-input class="inputx mb-3 w-full" label="Pdf con guia" v-model="cuaderno.pdfconguia" />
                <vs-input class="inputx mb-3 w-full" label="Pdf sin guia" v-model="cuaderno.pdfsinguia" />
                <vs-input class="inputx mb-3 w-full" label="Guia didactica" v-model="cuaderno.guiadidactica" />
                <vs-input class="inputx mb-3 w-full" label="Zip Cuaderno" v-model="cuaderno.zipcuaderno" />
                <vs-input class="inputx mb-3 w-full" label="Portada" v-model="cuaderno.portada" />
                Asignatura
                <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="nombreasignatura" class="w-full" v-model="cuaderno.asignatura" />
                 <br><br>
                <vs-button color="success" class="w-full mb-3" @click="guardarCuaderno()" type="gradient" >Guardar</vs-button>
            </vs-popup>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    data() {
        return{
            usuario:[],
            cuadernos:[],
            asignaturas:[],
            activeConfirm:false,
            popupEditCuaderno:false,
            update:false,
            id:0,
            idcuaderno:0,
            popupAddCuaderno:false,
            cuaderno:{
                nombrecuaderno:'',
                descripcioncuaderno:'',
                webcuaderno:'',
                execuaderno:'',
                pdfconguia:'',
                pdfsinguia:'',
                guiadidactica:'',
                zipcuaderno:'',
                asignatura:'',
                portada:'',
            },
            permisoRoot:false,
        }
    },
    components: {
        'v-select': vSelect,
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
        //para obtener el listado de los cuadernos
        getCuadernos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getCuadernos')
                .then(function (res) {
                    me.cuadernos = res.data.cuaderno
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        //para obtener el listado de asignaturas
        getAsinaturas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getCuadernos')
                .then(function (res) {
                    me.asignaturas = res.data.asignaturas
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        //para eliminar la area
        eliminarCuaderno() {
            let me = this;
            let formData = new FormData();
            formData.append('idcuaderno',me.idcuaderno);
            me.$vs.loading()
            this.$http.post(this.$server_url+'cuadernoEliminar', formData)
            .then(res => {
            me.getCuadernos();
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Cuaderno eliminado con exito',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            })
        },
        //para abrir el popup de confimacion para eliminar
        openConfirm(idcuaderno){
            let me = this;
            me.idcuaderno = idcuaderno;
            me.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmacion`,
            text: 'Estas seguro de eliminar.',
            accept:me.eliminarCuaderno
            })
        },
        //para guardar los cuadernos
        guardarCuaderno(){
            let me = this;
            let formData = new FormData();
            if(me.update){
                formData.append('crud',                 "yes");
                formData.append('idcuaderno',           me.id);
                formData.append('nombrecuaderno',       me.cuaderno.nombrecuaderno);
                formData.append('descripcioncuaderno',  me.cuaderno.descripcioncuaderno);
                formData.append('webcuaderno',          me.cuaderno.webcuaderno);
                formData.append('execuaderno',          me.cuaderno.execuaderno);
                formData.append('pdfconguia',           me.cuaderno.pdfconguia);
                formData.append('pdfsinguia',           me.cuaderno.pdfsinguia);
                formData.append('guiadidactica',        me.cuaderno.guiadidactica);
                formData.append('zipcuaderno',          me.cuaderno.zipcuaderno);
                formData.append('asignatura_idasignatura', me.cuaderno.asignatura.idasignatura);
                formData.append('portada',              me.cuaderno.portada);
            }else{
                formData.append('crud',                 "yes");
                formData.append('nombrecuaderno',       me.cuaderno.nombrecuaderno);
                formData.append('descripcioncuaderno',  me.cuaderno.descripcioncuaderno);
                formData.append('webcuaderno',          me.cuaderno.webcuaderno);
                formData.append('execuaderno',          me.cuaderno.execuaderno);
                formData.append('pdfconguia',           me.cuaderno.pdfconguia);
                formData.append('pdfsinguia',           me.cuaderno.pdfsinguia);
                formData.append('guiadidactica',        me.cuaderno.guiadidactica);
                formData.append('zipcuaderno',          me.cuaderno.zipcuaderno);
                formData.append('asignatura_idasignatura', me.cuaderno.asignatura.idasignatura);
            }
            me.$vs.loading();
            this.$http.post(this.$server_url+'cuadernos', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getCuadernos()
                    me.popupAddCuaderno=false,
                    me.popupEditCuaderno=false,
                    me.update = false;
                    me.limpiar()
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
        //para editar los campos
        openModalEditar(data={}){
            let me = this;
            me.popupEditCuaderno = true;
            //llenar la data en los campos
            me.id = data.idcuaderno;
            me.cuaderno.nombrecuaderno = data.nombrecuaderno;
            me.cuaderno.descripcioncuaderno = data.descripcioncuaderno;
            me.cuaderno.webcuaderno = data.webcuaderno;
            me.cuaderno.execuaderno = data.execuaderno;
            me.cuaderno.pdfconguia = data.pdfconguia;
            me.cuaderno.pdfsinguia = data.pdfsinguia;
            me.cuaderno.guiadidactica = data.guiadidactica;
            me.cuaderno.zipcuaderno = data.zipcuaderno;
            me.cuaderno.portada = data.portada;
            me.cuaderno.asignatura = {idasignatura:data.asignatura_idasignatura, nombreasignatura:data.nombreasignatura};
        },
        //para limpiar los campos
        limpiar(){
           let me = this;
           me.cuaderno.nombrecuaderno = "";
           me.cuaderno.descripcioncuaderno = "";
           me.cuaderno.webcuaderno = "";
           me.cuaderno.execuaderno = "";
           me.cuaderno.pdfconguia = "";
           me.cuaderno.pdfsinguia = "";
           me.cuaderno.guiadidactica = "";
           me.cuaderno.zipcuaderno = "";
           me.cuaderno.asignatura = "";
           me.cuaderno.portada = "";
        },
        //para ver el libro sin guia en el admin
        datopdfsinguia(data={}) {
            let me = this
            if (data.pdfsinguia === null || data.pdfsinguia === 'null') {
                me.$vs.notify({
                    text: 'El PDF sin guía aun no está disponible',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.url = data.pdfsinguia;
            let route = this.$router.resolve({path: '/admin/cuaderno/pdfsinguia'});
            window.open(route.href, '_blank');
        },
        //para ver el cuaderno con guia en el admin
        datopdfconguia(data={}) {
            let me = this
            if (data.pdfconguia === null || data.pdfconguia === 'null') {
                me.$vs.notify({
                    text: 'El PDF con guía aun no está disponible',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.url = data.pdfconguia;
            let route = this.$router.resolve({path: '/admin/cuaderno/pdfconguia'});
            window.open(route.href, '_blank');
        },
        datopdfguiadidactica(data={}) {
            let me = this
            if (data.guiadidactica === null || data.guiadidactica === 'null') {
                me.$vs.notify({
                    text: 'La guía didáctica aun no está disponible',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.url = data.guiadidactica;
            let route = this.$router.resolve({path: '/admin/cuaderno/pdfguiadidactica'});
            window.open(route.href, '_blank');
        },
    },
    created(){
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.getCuadernos();
        this.getAsinaturas();
        this.getUserRoot()
    }
}
</script>

<style scoped>
.image{
    width: 50px;
    border-radius: 5px;
    margin-bottom: 50px;
}
</style>
