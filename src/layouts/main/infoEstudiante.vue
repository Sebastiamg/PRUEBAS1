<template>
<div>
    <div>
        <vs-sidebar  click-not-close position-right parent="body"  default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
            <div  class="mt-6 flex items-center justify-between px-6"  >
                <!-- <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ITEM</h4> -->
                <h4>Actualización de información del estudiante</h4>
            </div>
            <vs-divider class="mb-0"></vs-divider>
            <component  :is="scrollbarTag" class="scroll-area--data-list-add-new" :key="$vs.rtl">
                <div class="p-6 text-center">
                    <p>
                        <img src="@/assets/images/pages/lock-screen.png" alt="login" class="mx-auto">
                    </p>
                    <br>
                    <div style="min-height: 600px">
                        <div style="border-radius: 10px;box-shadow: 0px 10px 30px #ccc;background-color: #5B93EA;">
                            <p class="mb-6 text-white py-5 px-2">
                                ! Estimado estudiante seleccione la ciudad y la institución en la que se encuentra <span class="font-bold">Actualmente</span>.
                            </p>
                        </div>
                        <br>
                        Seleccione la ciudad:
                        <v-select class="w-full mb-6" :options="ciudades" v-model="info.ciudad" @input="verInstCiudad2()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                    Seleccione una Institución:
                        <v-select class="w-full mb-6" :options="instituciones" v-model="info.institucion" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                        <vs-button class="w-full mt-4 mb-1" @click="actualizarInfoStudent()" icon="save" color="success" type="filled">Actualizar información</vs-button>
                    </div>
                </div>
            </component>
            <div  class="p-2 text-center" slot="footer">
                <vs-button color="danger" type="border" class="mb-2" @click="salir()">Salir</vs-button>
            </div>
        </vs-sidebar>    
    </div>
</div>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
export default {
    props: {
        isSidebarActive: {
            type: Boolean,
            required: true
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        'v-select': vSelect,
        VuePerfectScrollbar, 
    },
    data() {
        return {
            usuario:[],
            info:{
                ciudad:'',
                institucion:'',
            },
            ciudades:[],
            instituciones:[],
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        let me = this;
        // me.getCiudad()
    },
    computed: {
        isSidebarActiveLocal: {
            get() {
                return this.isSidebarActive
            },
            set(val) {
                if (!val) {
                    console.log('rr',val)
                    this.$emit('closeInfoEstudiante')
                }
            }
        },
        scrollbarTag() {
            return this.$store.getters.scrollbarTag
        }
    },
    methods: {
        async salir() {
            let me = this; 
            document.cookie='laravel_session=X;path=/;domain=.localhost;expires=Sat, 01-Jan-2000 00:00:00 GMT';
            this.$router.push('/');
            this.$store.dispatch('logout2')
            localStorage.clear()
            localStorage.setItem('bloqueo','yes')
            // this.$store.dispatch('logout')
            // location.reload();
            // return await this.$router.push('/');
        },
        // getCiudad() {
        //     let me = this;
        //     this.$http.get(this.$server_url + 'ciudades')
        //         .then(function (response) {
        //             me.ciudades = response.data;
        //         })
        //         .catch(function (error) {})
        // }, 
         verInstCiudad2() {
            let me = this;
            this.$http.get(this.$server_url + 'verInstitucionCiudad/' + me.info.ciudad.id)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
         //metodo para validar datos del estudiante
        validateInformationStudent(){
            let me = this;
            let institucion         = me.usuario.institucion_idInstitucion
            let periodo             = localStorage.periodo_id
            let estudiante          = me.usuario.idusuario
            this.$http.get(this.$server_url+'informationStudent?institucion_id='+institucion+'&periodo_id='+periodo+'&idusuario='+estudiante)
            .then(function (res) { 
                if(res.data.status == 1){
                    me.isSidebarActive = false
                }else{
                    me.isSidebarActive = true
                    me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'
                    })
                    location.reload()
                    return 
                }
               
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        actualizarInfoStudent(){
            let me = this; 
            me.isSidebarActiveLocal = false
            if(me.info.ciudad == null || me.info.ciudad == undefined || me.info.ciudad == ""){
                me.$vs.notify({
                  text:'Debe seleccionar una ciudad para poder actualizar',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'
                })
                return 
            }
            if(me.info.institucion == null || me.info.institucion == undefined || me.info.institucion == ""){
                me.$vs.notify({
                  text:'Debe seleccionar una ciudad para poder actualizar',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'
                })
                return 
            }
            let institucion_actual  = me.info.institucion.id
            let institucion         = me.usuario.institucion_idInstitucion
            let ciudad              = me.info.ciudad.id
            let periodo             = localStorage.periodo_id
            let estudiante          = me.usuario.idusuario 
            this.$http.get(this.$server_url+'informationStudent?institucion_id='+institucion+'&periodo_id='+periodo+'&ciudad_id='+ciudad+'&idusuario='+estudiante+'&institucion_actual='+institucion_actual+'&guardarInfo=yes')
                .then(function (res) { 
                    me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'
                    })
                    me.validateInformationStudent() 
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
    },
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
    ::v-deep .vs-sidebar--background {
        z-index: 52010;
    }

    ::v-deep .vs-sidebar {
        z-index: 52010;  
                    width: 100% ; 
        max-width: 100%;

        .img-upload {
            margin-top: 2rem;

            .con-img-upload {
                padding: 0;
            }
 
            .con-input-upload {
                width: 100%;
                margin: 0;
            }
        }
    }
}

.scroll-area--data-list-add-new {
    // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

    &:not(.ps) {
        overflow-y: auto;
    }
}
</style>
