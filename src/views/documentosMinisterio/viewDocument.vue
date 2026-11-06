<template>
<div class="vx-col md:w-full w-full mb-base h-screen">
    <vx-card class="h-full">
        <div class="vx-row mt-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Nombre: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="documento.nombre" maxlength="100" placeholder="Nombre del documento" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Descripción: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="documento.descripcion" maxlength="100" placeholder="Descripción del documento" />
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Asignaturas: </div>
                <vs-chip color="primary" :key="index" v-for="(item,index) in documento.asignaturas">
                    {{item.label}}
                </vs-chip>
            </div>
        </div>
        <vs-divider>Archivos cargados</vs-divider>
        <div class="vx-col  w-full">
            <vs-table max-items="10" search pagination :data="documentos" style="margin-top:-20px" class="stripe">
                <template slot="thead">
                    <vs-th>Nombre</vs-th>
                    <vs-th>url</vs-th>
                    <vs-th>Fecha de creación</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombre}} <br>
                        </vs-td>
                        <vs-td class="text-center">
                            <vx-tooltip text="Descargar archivo en mi equipo" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargarDocumento(tr)" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visualizar archivo" position="bottom" color="primary">
                                <vs-button style="display: inline" @click="mostrarArchivo(data[indextr])" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                            </vx-tooltip>
                            <!-- <a :href="'https://data.prolipadigital.com.ec/documentos/'+data[indextr].url" download>Descargar</a> -->
                        </vs-td>
                        <vs-td>
                            {{data[indextr].updated_at}} <br>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </vx-card>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    mixins: [historicoMixin],
    data() {
        return {
            documento: {},
            documentos: [],
            asignaturas: [],
            usuario: [],
            miusuario:[],

        }
    },
    created() {
        this.documento = JSON.parse(localStorage.getItem('doc'))

    },
    mounted() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario = me.usuario
        console.log(this.documento.nombre)
        this.getAsignaturas()
        this.getDocumento()
    },
    methods: {
        getAsignaturas() {
            let me = this
            this.$http.get(this.$server_url + 'asignaturasDoc/' + me.usuario.idusuario).then(res => {
                    me.asignaturas = res.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        getDocumento() {
            let me = this;
            this.$vs.loading()
            this.$http.get(this.$server_url + 'document?id=' + this.documento.id)
                .then(res => {
                    me.documentos = res.data
                    console.log(res.data)
                    me.$vs.loading.close()

                })
                .catch(error => {
                    console.log('no se conecto a los documentos ministeriales ' + error)
                    me.$vs.loading.close()
                })
        },
        descargarDocumento(item){
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 17; //17 = documentos minesterial
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'descargar',
                'recurso_tipo': 'documento minesterial',
                'recurso_nombre': me.documento.nombre,
                'recurso_detalle': 'archivo descargado '+item.nombre,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            let ruta = 'https://data.prolipadigital.com.ec/documentos/'+item.url
            window.open(ruta,'_blank')
            //:href="'https://data.prolipadigital.com.ec/documentos/'+data[indextr].url"
        },
        descargaArchivo(item) {
            axios({
                url: 'https://data.prolipadigital.com.ec/documentos/' + item, //your url
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', item); //or any other extension
                document.body.appendChild(link);
                link.click();
            });
        },
        mostrarArchivo(item) {
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 17; //17 = documentos minesterial
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'documento minesterial',
                'recurso_nombre': me.documento.nombre,
                'recurso_detalle': 'archivo visto '+item.nombre,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            if(item.url.substr(-3) == "pdf"){
            window.open('https://data.prolipadigital.com.ec/documentos/'+item.url,'_blank')
            }else{
                window.open('https://view.officeapps.live.com/op/embed.aspx?src=https://data.prolipadigital.com.ec/documentos/' + item.url)
            }
          
        },
    },
}
</script>
