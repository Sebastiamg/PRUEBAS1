<template>
<div>
    <div >
        <vs-sidebar  click-not-close position-right parent="body"  default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
            <div  class="mt-6 flex items-center justify-between px-6"  >
                <!-- <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ITEM</h4> -->
                <h4>Bloqueado</h4>
            </div>
            <vs-divider class="mb-0"></vs-divider>

            <component  :is="scrollbarTag" class="scroll-area--data-list-add-new" :key="$vs.rtl">

                <div class="p-6 text-center">
                    <p>
                        <img src="@/assets/images/pages/lock-screen.png" alt="login" class="mx-auto">
                    </p>
                    <br>
                    <h1>La Institución {{ nombreInstitucion }} no se encuentra habilitada para el periodo lectivo.</h1>

                    <!-- <h1>Su usuario no se encuentra habilitado para el periodo lectivo.</h1> -->
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
        },
    },
    components: {
        'v-select': vSelect,
        VuePerfectScrollbar,
       
    },
    data() {
        return {
            usuario:[],
            nombreInstitucion:'',
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getInstitucion()
    },
    mounted() {
        let me = this;
    },
    computed: {
        isSidebarActiveLocal: {
            get() {
                return this.isSidebarActive
            },
            set(val) {
                if (!val) {
                    this.$emit('closeSidebar')
                }
            }
        },
        isFormValid() {
            return !this.errors.any() && this.dataName && this.dataCategory && this.dataPrice > 0
        },
        scrollbarTag() {
            return this.$store.getters.scrollbarTag
        }
    },
    methods: {
        async getInstitucion(){
            let me = this     
            this.$http.get(this.$server_url+'institucion/'+me.usuario.institucion_idInstitucion)
                .then(function (res) {
                    me.nombreInstitucion = res.data.nombreInstitucion
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
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
        } 
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
