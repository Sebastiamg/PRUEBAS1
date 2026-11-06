<template>
    <div>
        <div class="con-tab-ejemplo">
            <div v-if="niveles.length >0 ">
              <vs-button color="dark" v-if="permisoRoot" @click="limpiar();popupAddNivel=true;"   type="filled">Crear Nivel</vs-button>
                <vs-table max-items="10" search pagination :data="niveles">
                    <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ niveles.length }}</b></vs-chip>
                    </template>
                    <template slot="thead">
                        <vs-th>Nombre</vs-th>
                        <vs-th>Oferta Academica</vs-th>
                        <vs-th colspan="2" style="width:100px;">Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].nombrenivel}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].nombreofertaAcademica}}<br>
                            </vs-td>
                            <vs-td>
                                <vx-tooltip style="display: inline-block;" text="Editar nivel" position="top" color="primary">
                                    <vs-button class="modal-default-button" color="success" @click="update=true;openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                </vx-tooltip> &nbsp;
                            </vs-td>
                            <vs-td>
                                <vx-tooltip style="display: inline-block;" text="Eliminar nivel" position="top" color="primary">
                                    <vs-button class="modal-default-button" color="danger" @click="openConfirm(data[indextr].idnivel)" type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                </vx-tooltip> &nbsp;
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <div v-else class="p-3">
                <p> No existe niveles aun. </p>
            </div>
        </div>
        <!--PARA LOS MODALES -->
          <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Nivel" :active.sync="popupAddNivel">
                <vs-input class="inputx mb-3 w-full" label="Nombre Nivel" v-model="nivel.nombrenivel" />
                Oferta Academica:
                <v-select :options="ofertas" :reduce="ofertas => ofertas" label="nombreofertaAcademica" class="w-full" v-model="nivel.oferta" />
                 <br><br>
                <vs-button color="success" class="w-full mb-3" @click="guardarNivel()" type="gradient" >Guardar</vs-button>
            </vs-popup>
        </div>
        <!-- Modal Editar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Editar Nivel" :active.sync="popupEditNivel">
                <vs-input class="inputx mb-3 w-full" label="Nombre Nivel" v-model="nivel.nombrenivel" />
                Tipo Area:
                <v-select :options="ofertas" :reduce="ofertas => ofertas" label="nombreofertaAcademica" class="w-full" v-model="nivel.oferta" />
                 <br><br>
                <vs-button color="success" class="w-full mb-3" @click="guardarNivel()" type="gradient" >Actualizar</vs-button>
            </vs-popup>
        </div>
    </div>
</template>
<script>
import vSelect from 'vue-select'
export default {
    data() {
        return{
            usuario:[],
            popupAddNivel:false,
            popupEditNivel:false,
            niveles:[],
            idnivel:0,
            id:0,
            update:false,
            nivel:{
                nombrenivel:"",
                oferta:""
            },
            ofertas:[],
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
        //para obtener el listado de los niveles
        getNiveles() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'nivel')
                .then(function (res) {
                    me.niveles = res.data.nivel
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
         //para obtener el listado de  oferta
        getOfertas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'nivel')
                .then(function (res) {
                    me.ofertas = res.data.oferta
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
         //para eliminar el nivel
         eliminarNivel() {
              let me = this;
              let formData = new FormData();
              formData.append('idnivel',me.idnivel);
              me.$vs.loading()
              this.$http.post(this.$server_url+'niveleliminar', formData)
              .then(res => {
                me.getNiveles();
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Nivel eliminado con exito',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
              })
        },
        //para abrir el popup de confimacion para eliminar
        openConfirm(idnivel){
            this.idnivel = idnivel;
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmacion`,
                text: 'Estas seguro de eliminar.',
                accept:this.eliminarNivel
            })
        },
         //para guardar el nivel
         guardarNivel(){
            let me = this;
             //datos que se obtienen de los inputs
                if(me.nivel.nombrenivel.trim() === ''){
                    this.$vs.notify({
                        text:'Debe completar todos los campos antes de guardar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }
            let formData = new FormData();
            if(me.update){
                formData.append('idnivel',     me.id);
                formData.append('nombrenivel', me.nivel.nombrenivel);
                formData.append('ofertaacademica_idofertaAcademica', me.nivel.oferta.idofertaAcademica);
            }else{
                formData.append('nombrenivel', me.nivel.nombrenivel);
                formData.append('ofertaacademica_idofertaAcademica', me.nivel.oferta.idofertaAcademica);
            }
            this.$http.post(this.$server_url+'nivel', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getNiveles()
                    me.popupAddNivel=false
                    me.popupEditNivel=false
                    me.update = false;
                    me.limpiar()
                })
                .catch(function (error) {})
        },

          //para editar los campos
        openModalEditar(data={}){
            let me = this;
            me.popupEditNivel = true;
            //llenar la data en los campos
            me.id = data.idnivel;
            me.nivel.nombrenivel = data.nombrenivel;
            me.nivel.oferta = {idofertaAcademica:data.ofertaacademica_idofertaAcademica, nombreofertaAcademica:data.nombreofertaAcademica};
        },
        //para limpiar los campos
        limpiar(){
           let me = this;
           me.nivel.nombrenivel = "";
           me.nivel.oferta = "";
        },
    },
    created(){
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.getNiveles();
        this.getOfertas();
        this.getUserRoot()
    }
}
</script>
