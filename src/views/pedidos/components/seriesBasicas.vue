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
                    </div>    
                </template>
                    <template slot="thead">
                        <vs-th>Nombre serie</vs-th>
                        <vs-th>Serie Básica</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].nombre_serie}}<br>
                            </vs-td>
                            <vs-td width="15%" style="text-align: center;">
                                <vs-alert color="success" v-if="tr.serie_basica == 1"><i class="fa-solid fa-check"></i> Si</vs-alert>
                                <vs-alert color="warning" v-if="tr.serie_basica == 0">No</vs-alert>
                            </vs-td>
                            <vs-td>
                                <div style="display: flex;">
                                    <vx-tooltip style="display: inline-block;" text="Editar serie" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="primary" @click="serie.serie_basica = tr.serie_basica;id = tr.id;guardarSerie()" type="filled" icon-pack="feather" icon="icon-edit"> Cambiar estado</vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </vs-td> 
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>
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
            id:0,
            popupAddTema:false,
            serie:{
                serie_basica:'',
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
    props:{
        id_periodo:{
            type:Number,
            default:0,
        },
    },  
    methods:{
        //para obtener el listado de las series
        getSeries() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'getSeriesBasicas/'+me.id_periodo)
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
            let formData = new FormData();
            formData.append('id',      me.id)
            let estado = 0
            if(me.serie.serie_basica == 0 )  estado = 1
            if(me.serie.serie_basica == 1 )  estado = 0
            formData.append('estado', estado)
            me.$vs.loading();
            this.$http.post(this.$server_url+'cambiarSerieBasica', formData)
                .then(function (res) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getSeries()
                    me.limpiar()
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
        //para limpiar los campos
        limpiar(){
           let me = this;
           me.id = 0;
           me.serie.serie_basica = "0";
        },
    },
    created(){
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
       
 
    },
    mounted(){
        this.getSeries() 
    },
}
</script>