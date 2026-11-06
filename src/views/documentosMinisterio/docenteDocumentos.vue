<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <vs-button v-if="grupo_usuario==1" class="m-1" @click="nuevoDoc()" color="success">Agregar</vs-button>
        <vs-table max-items="10" search pagination :data="documentos" style="margin-top:-20px" class="stripe">
            <template slot="header">
                <p>Total de documentos ministeriales registrados: <b>{{documentos.length}}</b> </p>
            </template>
            <template slot="thead">
                <vs-th>Nombre</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td width="50%">
                        {{data[indextr].nombre}} <br>
                        <small>{{data[indextr].descripcion}}</small>
                    </vs-td>
                    <vs-td>
                        <small v-if="data[indextr].estado" class="text-success"> Publicado</small>
                        <small v-else class="text-danger">Inactivo</small><br>
                        <small> Actualizada: {{fechaLarga(data[indextr].updated_at)}} </small>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip v-if="grupo_usuario == 1" style="display: inline-block;" text="editar publicación" position="top" color="success">
                            <vs-button @click="editarDoc(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                        </vx-tooltip>
                        <div v-if="usuario.id_group == 16">
                            <vx-tooltip v-if="documentom.ver == '1'" style="display: inline-block;" text="ver publicación" position="top" color="primary">
                                <vs-button @click="verAdaptacion(data[indextr])" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="gradient"></vs-button>
                            </vx-tooltip>
                        </div>
                        <div v-else>
                            <vx-tooltip style="display: inline-block;" text="ver publicación 2" position="top" color="primary">
                                <vs-button @click="verAdaptacion(data[indextr])" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="gradient"></vs-button>
                            </vx-tooltip>        
                        </div>
                        <vx-tooltip v-if="grupo_usuario == 1" style="display: inline-block;" text="eliminar publicaciòn" position="top" color="danger">
                            <vs-button @click="openConfirm(data[indextr].id)" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
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
            usuario:[],
            documentos: [],
            pesoArchivo: '',
            porcentaje: '',
            grupo_usuario: '',
            idasignatura:'',
                 //====VARIABLES PARA RECURSOS EXTERNOS
            libro:{
                libroweb:'1',
                libro_con_guia:'1',
                guia_didactica:'1',
                unidades:'1',
            },
            curso:{
                ver:'1',
                agregar:'1',
                editar:'1',
                eliminar:'1',
            },
            cuaderno:{
                guia:'1',
                didactica:'1',
                web:'1',
            },
            planificacion:{
                descargar:'1',
                visualizar:'1',
            },
            //variables para recursos adicionales
            mijuego:{
                agregar:'1',
                editar:'1',
                eliminar:'1',
                ver:'1',
                asignar:'1',
            },
            juegoProlipa:{
                asignar:'1',
                ver:'1',
                previsualizar:'1',
            },
            materialDigital:{
                ver:'1',
                previsualizar:'1',
                asignar:'1',
            },
            materialpdf:{
                subir:'1',
                ver:'1',
                descargar:'1',
                asignar:'1',
            },
            propuesta:{
                ver:'1',
            },
            adaptacion:{
                ver:'1',
            },
            articulo:{
                lengua:'1',
                matematica:'1',
                naturales:'1',
                sociales:'1',
                ensenanza:'1',
            },
            documentom:{
                ver:'1',
            },
            permisosExternos:'',
          //fin de variables para recursos adicionales
          //FIN DE VARIABLES PARA RECURSOS EXTERNOS
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.idasignatura = localStorage.idasignatura
        me.grupo_usuario = me.usuario.id_group;
        me.getDocumentos();
          //PERMISOS EXTERNOS
        if(localStorage.status_permisos == "yes"){
            me.permisosExternos = JSON.parse(localStorage.permisosExternos)
            me.libro                    = me.permisosExternos.permisos_libros
            me.curso                    = me.permisosExternos.permisos_cursos
            me.cuaderno                 = me.permisosExternos.permisos_cuadernos
            me.planificacion            = me.permisosExternos.permisos_planificaciones
            //data de los recursos adicionales
            me.mijuego                  = me.permisosExternos.zona_diversion_mi_juego
            me.juegoProlipa             = me.permisosExternos.zona_diversion_juego_prolipa 
            me.materialDigital          = me.permisosExternos.material_apoyo_digital 
            me.materialpdf              = me.permisosExternos.material_apoyo_pdf 
            me.propuesta                = me.permisosExternos.propuestas_metodologicas 
            me.adaptacion               = me.permisosExternos.adaptaciones 
            me.articulo                 = me.permisosExternos.articulos 
            me.documentom               = me.permisosExternos.documentos_ministeriales 
        }
        //FIN DE PERMISOS EXTERNOS
    },
    methods: {
        getDocumentos() {
            let me = this;
            this.$http.get(this.$server_url + 'getDocumentosDocente?idasignatura=' + me.idasignatura)
                .then(res => {
                    me.documentos = res.data
                    console.log(res.data)
                })
                .catch(error => {
                    console.log('no se conecto a los documentos ministeriales ' + error)
                })
        },
        nuevoDoc() {
            let me = this;
            me.$router.push('/admin/nuevoDocumento');
        },
        verAdaptacion(item) {
            let me = this;
            localStorage.setItem('doc', JSON.stringify(item));
            if(me.usuario.id_group == 16){
                me.$router.push('/colegios/ministerio/docente/documento');
            }else{
                me.$router.push('/ministerio/docente/documento');
            }
         
        },
        editarDoc(item) {
            let me = this;
            localStorage.setItem('doc', JSON.stringify(item));
            me.$router.push('/admin/editarDocumentos');
        },
        openConfirm(id, nombre) {
            let me = this;
            me.id = id

            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmación`,
                text: 'Está seguro en eliminar este archivo',
                accept: this.getEliminar
            })
        },
        getEliminar(id) {
            let me = this;
            console.log(id)
            this.$http.post(this.$server_url + "documentDelete?id=" + me.id)

                .then(function (response) {
                    me.$vs.notify({
                        color: 'warning',
                        text: 'Registro eliminado'
                    })
                    me.getDocumentos()
                })
                .catch(function (error) {})
        }
    }
}
</script>
