<template>
<div>
    <div class="vx-row">
        <div class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base" v-for="(item,$index) in instituciones" :key="$index">
            <vx-card class="p-2" @click="getDatos(item)">
                <div class="text-center divinst">
                    <span class="textinst">{{ item.nombreInstitucion }}</span>
                </div>
                <vs-avatar class="mx-auto my-6 block" size="80px" :src="$server_url+'uploads/pngtree_bankinstitutionmoneyireland_abstract_circle_background_fla_png_image_1484516_482e7303de.jpg'" />
            </vx-card>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
    data() {
        return {
            usuario: [],
            users: [],
            docentes: [],
            data: [],
            instituciones: [],
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    mounted() {
        this.getInstituciones();
    },
    methods: {
        getInstituciones() {
            let me = this;
            this.$http.get(this.$server_url+"director-instituciones?idusuario=" + me.usuario.idusuario)
                .then(res => {
                    console.log(res)
                    res.data.forEach(element => {
                        this.$http.get(this.$server_url+"institucion/" + element.idinstitucion)
                            .then(function (response) {
                                console.log(response.data)
                                me.instituciones.push(response.data)
                            })
                            .catch(function (error) {})
                    });
                })
                .catch(err => {
                    console.error(err);
                })
        },
        async getDatos(item) {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            var conaccesos = 0;
            var sinaccesos = 0;
            await this.$http.get(this.$server_url+"docentes?idInstitucion=" + item.idInstitucion)
                .then(function (response) {
                    response.data.forEach(async (element) => {
                        var usuario = new Object();
                        usuario.idusuario = element.idusuario;
                        usuario.cedula = element.cedula;
                        usuario.nombres = element.nombres;
                        usuario.apellidos = element.apellidos;
                        await this.$http.get(this.$server_url+"estudiantes?idusuario=" + element.idusuario)
                            .then(res => {
                                if (res.data.length > 0) {
                                    conaccesos++;
                                    usuario.accesos = res.data.length;
                                    var aux = res.data.length
                                    me.data.push([element.nombres + " " + element.apellidos, res.data.length, element.idusuario, element.cedula])
                                } else {
                                    sinaccesos++;
                                    me.data.push([element.nombres + " " + element.apellidos, 0, element.idusuario, element.cedula])
                                    usuario.accesos = 0;
                                }
                                localStorage.setItem('data', JSON.stringify(me.data));
                            })
                            .catch(err => {
                                console.error(err);
                            })
                        me.docentes.push(usuario);
                    });
                })
                .catch(function (error) {})
            await this.$http.get(this.$server_url+"contenidos?idinstitucion=" + item.idInstitucion)
            .then(res => {
                localStorage.setItem('contenidos', JSON.stringify(res.data));
            })
            .catch(err => {
                console.error(err); 
            })
            setTimeout(function () {
                localStorage.sinaccesos = sinaccesos;
                localStorage.conaccesos = conaccesos;
                localStorage.setItem('docentes', JSON.stringify(me.docentes));
                localStorage.setItem('institucion', JSON.stringify(item))
                me.$vs.loading.close()
                me.$router.push('/estadisticas');
            }, 5000);
        },
        getDate(date) {
            var d = new Date(date);
            var datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            return datestring;
        },
    },
}
</script>

<style>
.textinst {
    font-size: 13px;
}

.divinst {
    height: 60px;
}
</style>
