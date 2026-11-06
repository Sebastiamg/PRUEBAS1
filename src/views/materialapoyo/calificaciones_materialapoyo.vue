<template>
<div>
<vx-card>
    <vs-button style="display:inline-block" @click="$router.go(-1);" color="dark" type="border" class="mr-4"><b>← Volver</b></vs-button>
    <h4 style="display:inline-block">
        <b>Curso:</b> {{nombre_curso}} - <b>Material:</b> {{nombre_material}}
    </h4>
<div v-if="calificaciones.length > 0">
    <vs-table stripe pagination max-items="30" search :data="calificaciones">
        <template slot="thead">
            <vs-th style="max-width: 20px;">#</vs-th>
            <vs-th>Estudiante</vs-th>
            <vs-th>Cédula</vs-th>
            <vs-th>Calificación</vs-th>
        </template>

        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <td>
                    {{ indextr+1 }}
                </td>
                <vs-td>
                    {{ data[indextr].nombres }} {{ data[indextr].apellidos }} <br>
                    {{ data[indextr].email }}
                </vs-td>
                <vs-td width="30%">
                    {{ data[indextr].cedula }}
                </vs-td>
                <vs-td>
                    {{ data[indextr].calificacion }}
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
</div>
<div v-else>
    Ninguna calificacion para este material todavía.
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
            calificaciones: [],
            nombre_curso: '',
            nombre_material: '',
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.nombre_curso = localStorage.nombre_curso_calif
        me.nombre_material = localStorage.nombre_material_calif
        me.getCalificaciones();
    },
    methods: {
        getCalificaciones() {
            let me = this;
            me.$vs.loading()
            let formData = new FormData();
            formData.append('codigo_curso', localStorage.codigo_calif);
            formData.append('id_material', localStorage.id_material_calif);
            this.$http.post(this.$server_url+'calificaciones_material_curso', formData)
                .then(res => {
                    me.calificaciones = res.data;
                    me.$vs.loading.close()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
    }
}
</script>
