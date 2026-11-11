<template>
    <div>
        <div class="con-tab-ejemplo">
            <div>
                <vs-table max-items="10" search pagination :data="series">
                    <template slot="header">
                    <div style="display:flex;">
                        <vs-chip color="primary" style="font-size:12px;">
                          Cantidad: {{series.length}}
                        </vs-chip>
                        <vs-button icon="edit" class="ml-2" color="dark" size="small" @click="limpiar();popupAddTema=true;title='Agregar Serie'"   type="filled">Crear Serie</vs-button>
                    </div>
                </template>
                    <template slot="thead">
                        <vs-th>Nombre serie</vs-th>
                        <!-- <vs-th>Longitud numeros</vs-th>
                        <vs-th>Longitud letras</vs-th> -->
                        <vs-th>Longitud codigo</vs-th>
                        <vs-th>Longitud codigo Grafitex</vs-th>
                        <vs-th>Serie Padre</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].nombre_serie}}<br>

                            </vs-td>
                            <!-- <vs-td>
                                {{data[indextr].longitud_numeros}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].longitud_letras}}<br>
                            </vs-td> -->
                            <vs-td>
                                {{data[indextr].longitud_codigo}}<br>
                            </vs-td>
                            <vs-td>
                                {{ tr.longitud_codigo_grafitext }}
                            </vs-td>
                            <vs-td>
                                {{ getSeriePadreNombre(tr.id_seriePadre) }}
                            </vs-td>
                            <vs-td>
                                <div style="display: flex;">
                                    <vx-tooltip style="display: inline-block;" text="Editar serie" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="success" @click="update=true;openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                    </vx-tooltip> &nbsp;
                                    <vx-tooltip style="display: inline-block;" text="Eliminar serie" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="danger" @click="update=true;openConfirm(data[indextr].id_serie)" type="filled" icon-pack="feather" icon="icon-delete"> </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
        <!--PARA LOS MODALES -->
          <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" :title="title" :active.sync="popupAddTema">
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                    <span>Nombre serie</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-book" icon-no-border v-model="serie.nombre_serie" />
                    </div>
                </div>
                <!-- <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                    <span>Longitud numeros</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                    <vs-input type="number" class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="serie.longitud_numeros" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                    <span>Longitud letras</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                    <vs-input type="number" class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="serie.longitud_letras" />
                    </div>
                </div> -->
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                    <span>Longitud codigo</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                    <vs-input type="number" class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="serie.longitud_codigo" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                    <span>Longitud codigo Grafitex</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                    <vs-input type="number" class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="serie.longitud_codigo_grafitext" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                    <span>Serie Padre (Serie Plus)</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                    <v-select
                        :options="series"
                        label="nombre_serie"
                        :reduce="serie => serie.id_serie"
                        v-model="serie.id_seriePadre"
                        placeholder="Seleccione una serie padre"
                    >
                    </v-select>
                    </div>
                </div>
                <div class="vx-row">
                    <div  class="vx-col sm:w-1/3 w-full">
                    <vs-button  color="warning" icon="save" class="mr-3 mb-2" @click="guardarSerie()">Guardar</vs-button>
                    </div>
                </div>
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
            series:[],
            activeConfirm:false,
            update:false,
            id:0,
            popupAddTema:false,
            serie:{
                nombre_serie:'',
                longitud_numeros:'',
                longitud_letras:'',
                longitud_codigo:'',
                longitud_codigo_grafitext:'',
                id_seriePadre: null,
            },
            estado:'',
            permisoRoot:false,
            usuario:[],
            title:'',
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
        //para obtener el listado de las series
        getSeries() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'series')
                .then(function (res) {
                    me.series = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        //para eliminar la serie
         eliminarSerie() {
              let me = this;
              me.$vs.loading()
              this.$http.delete(this.$server_url+'series/'+me.id)
              .then(res => {
                 me.getSeries();
                  me.$vs.loading.close()
                  me.$vs.notify({
                  text:'Serie eliminada con exito',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
              })
        },
        //para abrir el popup de confimacion para eliminar
        openConfirm(id,estado){
            this.id = id;
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmacion`,
                text: 'Estas seguro de eliminar esta serie?.',
                accept:this.eliminarSerie
            })
        },
        //para guardar las series
         guardarSerie(){
            let me = this;
             //datos que se obtienen de los inputs
            if(me.serie.nombre_serie.trim() === ''){
                this.$vs.notify({
                    text:'Debe completar todos los campos antes de guardar',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return;
            }
            me.$vs.loading();
            let formData = new FormData();
            formData.append('id',               me.id)
            formData.append('nombre_serie',     me.serie.nombre_serie)
            formData.append('longitud_numeros', me.serie.longitud_numeros)
            formData.append('longitud_letras',  me.serie.longitud_letras)
            formData.append('longitud_codigo',  me.serie.longitud_codigo)
            formData.append('longitud_codigo_grafitext',  me.serie.longitud_codigo_grafitext)
            formData.append('id_seriePadre',  me.serie.id_seriePadre || '')
            this.$http.post(this.$server_url+'series', formData)
                .then(function (res) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getSeries()
                    me.popupAddTema=false
                    me.limpiar()

                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })



        },
        //para editar los campos
        openModalEditar(data){
            let me = this;
            me.title = "Editar Serie";
            me.popupAddTema = true;
            //llenar la data en los campos
            me.id = data.id_serie;
            me.serie.nombre_serie       = data.nombre_serie;
            me.serie.longitud_numeros   = data.longitud_numeros;
            me.serie.longitud_letras    = data.longitud_letras;
            me.serie.longitud_codigo    = data.longitud_codigo;
            me.serie.longitud_codigo_grafitext    = data.longitud_codigo_grafitext;
            me.serie.id_seriePadre      = data.id_seriePadre;
        },
        //para limpiar los campos
        limpiar(){
           let me = this;
           me.id = 0;
           me.serie.nombre_serie = "";
           me.serie.longitud_numeros = "";
           me.serie.longitud_letras = "";
           me.serie.longitud_codigo = "";
           me.serie.longitud_codigo_grafitext = "";
           me.serie.id_seriePadre = null;
        },
        //para obtener el nombre de la serie padre
        getSeriePadreNombre(id_seriePadre){
            if(!id_seriePadre) return '-';
            let serie = this.series.find(s => s.id_serie === id_seriePadre);
            return serie ? serie.nombre_serie : '-';
        },
    },
    created(){
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.getSeries();
        this.getUserRoot()

    }
}
</script>
