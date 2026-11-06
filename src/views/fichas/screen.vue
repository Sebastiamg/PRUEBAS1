<template>
<div>
    <vx-card>
        <div>
            <div>
                <vs-button type="gradient" color="primary" icon="add" @click="ficha={};popupAdd = true;">Agregar</vs-button>
            </div>
            <listadoFichaVue :listaDatos="listaDatos" @recharge="recharge" @changeEdit="changeEdit"/>
        </div>
        <div >
            <vs-popup class="holamundo" fullscreen  title="Fichas" :active.sync="popupAdd">
                <New v-if="popupAdd" :ficha="ficha" @recharge="recharge" />
            </vs-popup>
        </div>
    </vx-card>
</div>
</template>

<script>
import vSelect from 'vue-select';
import New from './new.vue';
import listadoFichaVue from './listadoFicha.vue';
export default {
    components: {
        "v-select": vSelect,
        New,
        listadoFichaVue,
    },
    data() {
        return {
            listaDatos:[],
            ficha:{},
            popupAdd:false,
        }
    },
    mounted() {
        let me = this;
        me.f_getFichas()
    },
    methods: {
        recharge(e){
            let me = this;
            me.f_getFichas()
            me.popupAdd = false
        },
        changeEdit(e){
            let me = this;
            me.ficha = {}
            me.ficha = e
            me.popupAdd = true
        },
        f_getFichas() {
            let me = this;
            // me.modalAdd = false;
            this.$http.get(this.$server_url + 'fichas')
                .then(res => {
                    me.listaDatos = res.data
                    console.log(res.data)
                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close();
                })
        },
    },
}
</script>
