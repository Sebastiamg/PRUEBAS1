<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <div class="vx-col sm:w-1/1 w-full mb-4">
            <vs-input class="w-full" type="text" label="Nombre:" icon-pack="feather" icon="icon-type" maxlength="200" icon-no-border v-model="asignatura.nombre_asignatura" />
        </div>
        <div class="vx-col  w-full mb-4">
            <vs-input class="w-full" type="text" label="Descripción:" icon-pack="feather" icon="icon-align-center" maxlength="200" icon-no-border v-model="asignatura.descripcion_asignatura" />
        </div>
        <div class="vx-col w-full mb-4">
            <vs-radio class="m-2" v-model="asignatura.estado" vs-value="1">Activa</vs-radio>
            <vs-radio class="m-2" v-model="asignatura.estado" color="danger" vs-value="0">Bloqueada</vs-radio>
        </div>
        <div class="vx-col  w-full mb-4">
            <vs-button class="m-2" color="primary" type="border" @click="agregarEditarArea();">{{txt_boton}}</vs-button>
            <vs-button class="m-2" color="danger" type="border" @click="volver();">Cancelar</vs-button>
        </div>
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
            asignatura: {
                'id_asignatura ': '',
                'id_area': '',
                'nombre_asignatura	': '',
                'descripcion_asignatura': '',
                'cant_preguntas': '',
                'estado': '',
            },
            titulo: '',
            txt_boton: '',
            txt_msj: '',
            listaAsignaturas: [],
        }
    },
    mounted() {
        let me = this;
        me.getAsignaturas();
    },
    methods: {
        getAsignaturas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'asignaturas_salle?n_evaluacion='+localStorage.getItem('EvaluacionSelectSalle'))
                .then(res => {
                    console.log(res.data)
                    me.listaAsignaturas = res.data
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
    }
}
</script>
