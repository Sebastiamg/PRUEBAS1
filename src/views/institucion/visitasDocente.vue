<template>
<div class="vx-col md:w-full w-full mb-base">
    <!-- <vs-button @click="volver()" color="dark" type="border">Volver</vs-button> &nbsp; -->
    <vx-card>        
        <p><b>Nombre:</b> {{datoU.nombres}} {{datoU.apellidos}} </p>
        <p><b>Email:</b> {{datoU.email}} </p>
        <p><b>Cédula:</b> {{datoU.cedula}} </p>
        <div v-if="listaVisitas.length>0">
        <vs-table max-items="30" search pagination :data="listaVisitas">
            <template slot="header">
                Ultimas visitas &nbsp; <small> <i>(max. 100): </i></small> &nbsp; {{listaVisitas.length}}
            </template>
            <template slot="thead">
                <vs-th sort-key="cedula">Fecha</vs-th>
                <vs-th sort-key="nombres">Hora</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].fecha}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].hora}}
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        </div>
        <div v-else>
            <p class="p-5"> No tenemos registros de este usuario en nuestra base de datos, regrese mas tardecito :) </p>
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
            docente: '',
            listaVisitas: [],
            datoU:'',
        }
    },
    mounted() {
        let me = this;
        me.datoU = JSON.parse(localStorage.getItem('datoUser'))
        // console.log(me.docente)
        me.getVisitas();
    },
    methods: {
        getVisitas() {
            let me = this;
            axios.get('https://foro.prolipadigital.com.ec/estudiantes?idusuario=' + me.datoU.idusuario + '&_sort=updatedAt:DESC')
                .then(res => {
                    me.listaVisitas = res.data;
                    // console.log(me.listaVisitas)
                })
                .catch(error => {
                    console.log(' no se conecto a consultar las visitas ')
                })
        },
        volver() {
            let me = this;
            me.$router.go(-1);
        }
    }
}
</script>
