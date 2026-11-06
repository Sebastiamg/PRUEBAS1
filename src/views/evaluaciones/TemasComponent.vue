<template>
    <div>
        <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Tema" :active.sync="popupAddTema">
                <vs-input class="inputx mb-3 w-full" label="Nombre Tema" v-model="tema.nombre"/>
                
                <div class="mb-3">
                    <label class="text-sm font-semibold mb-2 block">Asignatura:</label>
                    <v-select 
                        v-model="tema.asignatura" 
                        :options="asignaturas" 
                        :dir="$vs.rtl ? 'rtl' : 'ltr'" 
                        @input="getUnidadesAsignatura()"
                        disabled
                    />
                    <p class="text-xs text-gray-500 mt-1">La asignatura se selecciona desde el filtro principal</p>
                </div>
                <div class="mb-3">
                    <label class="text-sm font-semibold mb-2 block">Unidad:</label>
                    <v-select 
                        v-model="tema.unidad" 
                        :options="unidades_asignatura" 
                        :dir="$vs.rtl ? 'rtl' : 'ltr'"
                    />
                </div>

                <vs-input class="inputx mb-6 w-full" label="Destreza/indicador (opcional)" v-model="tema.clasificacion"/>

                <vs-button color="success" class="w-full mb-3" type="gradient" @click="agregar()">Guardar</vs-button>
            </vs-popup>
        </div>
        <!----FIN MODAL AGREGAR-->
        <!-- Modal Editar Temas-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Editar Tema" :active.sync="popupEditTema">
                <vs-input class="inputx mb-3 w-full" label="Nombre Tema" v-model="tema.nombre"/>
                Asignatura:
                <v-select class="mb-3" v-model="tema.asignatura" :options="asignaturas" :dir="$vs.rtl ? 'rtl' : 'ltr'" @input="getUnidadesAsignatura()" disabled/>
                Unidad:
                <v-select class="mb-3" v-model="tema.unidad" :options="unidades_asignatura" :dir="$vs.rtl ? 'rtl' : 'ltr'"/>
                <vs-input class="inputx mb-6 w-full" label="Clasificación (opcional)" v-model="tema.clasificacion"/>
                <vs-button color="success" class="w-full mb-3" type="gradient" @click="editarTema(tema)">Editar</vs-button>
            </vs-popup>
        </div>
        <!----FIN MODAL EDITAR---->
        <!--LISTADO DE TEMA-->
        <div class="mt-5">
            <!-- Selector de Asignatura Principal -->
            <div class="vx-row mb-6">
                <div class="vx-col w-full">
                    <div class="p-6 bg-white rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-3">Selecciona una Asignatura</h3>
                        <v-select 
                            class="mb-3" 
                            v-model="Filtroasignatura" 
                            :options="asignaturas" 
                            placeholder="Selecciona una asignatura para comenzar..."
                            :dir="$vs.rtl ? 'rtl' : 'ltr'" 
                            @input="onAsignaturaChange()"
                        />
                        <p class="text-sm text-gray-600 mt-2" v-if="!Filtroasignatura">
                            Por favor selecciona una asignatura para ver y gestionar sus temas
                        </p>
                    </div>
                </div>
            </div>

            <!-- Botones de Acción -->
            <div class="vx-row mb-4" v-if="Filtroasignatura">
                <div class="vx-col w-full text-center">
                    <vs-button @click="abrirModalCrear()" color="dark" size="large" style="font-size: 14px;" type="filled" class="mr-2">
                        ➕ Crear Tema
                    </vs-button>
                    <vs-button @click="$router.push('/bancopreguntas')" color="primary" size="large" class="mr-2" style="font-size: 14px;" type="filled">
                        📝 Crear Preguntas
                    </vs-button>
                    <vs-button @click="filtroTemas()" color="warning" size="large" class="mr-2" style="font-size: 14px;" type="filled">
                        � Refrescar
                    </vs-button>
                    <vs-button color="success" v-if="temas.length > 0" @click="exportarTemas" size="large" style="font-size: 14px;">
                        📥 Exportar Excel
                    </vs-button>
                </div>
            </div>

            <vs-divider v-if="Filtroasignatura"></vs-divider>

            <!-- Tabla de Temas -->
            <div v-if="Filtroasignatura" align="center">
                <vs-table v-model="temaSelected" pagination max-items="25" search :data="temas">
                    <template slot="header">
                        <span class="font-semibold">Temas de {{ Filtroasignatura.label }} - Total: {{temas.length}}</span>
                    </template>
                <template slot="thead">
                    <vs-th sort-key="clasificacion">Destreza</vs-th>
                    <vs-th sort-key="pregunta">Tema</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].clasificacion">
                        {{ data[indextr].clasificacion }}
                    </vs-td>
                    <vs-td :data="data[indextr].nombre_tema">
                        #{{ tr.id }} <br>
                        {{ 'Tema: ' + data[indextr].label }}<br><!--label=nombre_tema-->
                        {{ 'Asignatura: ' + data[indextr].nombreasignatura }}<br>
                        {{ 'Unidad: ' + data[indextr].unidad }}<br>
                    </vs-td>
                    <vs-td :data="data[indextr].id">
                        <vs-button @click="editarFormulario(data[indextr]); popupEditTema=true" class="mr-3" color="success" type="gradient" style="font-size: 12px; padding: 7px 7px 7px 7px; width: 80px; display: inline-block;" size="small" v-if="usuario.idusuario===data[indextr].idusuario || usuario.id_group===1 || usuario.id_group===5">editar</vs-button>
                        <vs-button @click="id_tema=data[indextr].id; itemTemas=data[indextr]; openConfirm();" color="danger" type="gradient" style="font-size: 12px; padding: 7px 7px 7px 7px; width: 80px; display: inline-block;" size="small" v-if="usuario.idusuario===data[indextr].idusuario || usuario.id_group===1 || usuario.id_group===5">eliminar</vs-button>
                    </vs-td>
                </vs-tr>
                </template>
            </vs-table>
            </div>

            <!-- Mensaje cuando no hay asignatura seleccionada -->
            <div v-else class="text-center p-20">
                <p class="text-gray-500 text-lg">👆 Selecciona una asignatura arriba para comenzar</p>
            </div>
            <br><br><br><br><br><br>
        </div>
    </div>
</template>
<script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import Vue from 'vue'
    import axios from 'axios'
    import vSelect from 'vue-select'
    import moment from 'moment'
    import Codigosmix from "@/mixins/Codigosmix";
    export default {
        mixins: [Codigosmix],
        data(){
            return {
                temas: [],
                tema: {nombre: '', asignatura: '', unidad: '', clasificacion: ''},
                temaBuscar: null,
                asignaturas: [],
                asignatura: {id: '', label: ''},
                editarActivo: false,
                temaSelected: [],
                asignaturaSelected: {id: '', label: ''},
                popupAddTema: false,
                popupEditTema: false,
                usuario: [],
                docente: null,
                unidades: [
                    {
                    id: "1", label: "Unidad 1", }, { id: "2", label: "Unidad 2", }, { id: "3", label: "Unidad 3", }, { id: "4", label: "Unidad 4", }, { id: "5", label: "Unidad 5", }, { id: "6", label: "Unidad 6", }, { id: "7", label: "Unidad 7", }, { id: "8", label: "Unidad 8", }, { id: "9", label: "Unidad 9", }, { id: "10", label: "Unidad 10",
                    },
                ],
                unidades_asignatura: [],
                id_tema: '',
                itemTemas: [],
                Filtroasignatura:'',
            }
        },
        components: {
            'v-select': vSelect,
            flatPickr
        },
        async created(){
            this.usuario = JSON.parse(localStorage.getItem('usuario'));
            this.docente = this.usuario.idusuario
            this.verTemas();
        },
        methods: {
            onResize() {
            if (window.innerWidth < 769)
                this.isMobile = true;
            else
                this.isMobile = false;
            },
            limpiar(){
                this.tema.nombre = '';
                // Mantener la asignatura seleccionada del filtro
                this.tema.asignatura = this.Filtroasignatura;
                this.tema.unidad = '';
                this.tema.clasificacion = '';
            },
            verTemas(){
                let me = this
                if( localStorage.idasignatura ){
                    this.tema.asignatura = {id: localStorage.idasignatura, label: localStorage.nombreasignatura}
                }
                // me.$vs.loading()
                switch (this.usuario.id_group) {
                    case 1 || 5:
                        // this.$http.get(this.$server_url+'tema').then(res => {
                        //     this.temas = res.data;
                        // }).then(res => {
                        //     this.$vs.loading.close()
                        // }),
                        this.$http.get(this.$server_url+'asignaturasDoc/0').then(res => {
                            this.asignaturas = res.data;
                        })
                        break;
                    default:
                        this.$http.get(this.$server_url+'tema/'+this.usuario.idusuario).then(res => {
                            this.temas = res.data;
                        }).then(res => {
                            this.$vs.loading.close()
                        }),
                        this.$http.get(this.$server_url+'asignaturasCreaDoc/'+this.usuario.idusuario).then(res => {
                            this.asignaturas = res.data;
                        })
                        break;
                }

            },
            filtroTemas(){
                let me = this;
                me.temas = []
                if(me.Filtroasignatura == null || me.Filtroasignatura == undefined || me.Filtroasignatura == ""){
                    return;
                }
                me.$vs.loading();
                this.$http.get(this.$server_url+'tema?byAsignatura=yes&asignatura='+me.Filtroasignatura.idasignatura).then(res => {
                    me.$vs.loading.close();
                    this.temas = res.data;
                }).then(res => {
                    this.$vs.loading.close()
                });
            },
            onAsignaturaChange(){
                // Filtrar temas y pre-seleccionar asignatura para crear
                this.filtroTemas();
                this.tema.asignatura = this.Filtroasignatura;
                this.getUnidadesAsignatura();
            },
            abrirModalCrear(){
                this.limpiar();
                // La asignatura ya está pre-seleccionada desde onAsignaturaChange
                this.popupAddTema = true;
            },
            agregar(){//datos que se obtienen de los inputs
                if(this.tema.nombre.trim() === '' || this.tema.unidad === ''){
                    this.$vs.notify({
                        text:'Debe completar todos los campos antes de guardar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }
                
                let id_unidad = '';
                let num_unidad = '';
                
                // Si la unidad tiene la propiedad 'unidad' (viene de la BD)
                if(this.tema.unidad.unidad !== undefined && this.tema.unidad.unidad !== null){
                    num_unidad = this.tema.unidad.unidad;
                    id_unidad = this.tema.unidad.id || '';
                } else {
                    // Si la unidad NO tiene la propiedad 'unidad' (es una unidad genérica 1-10)
                    num_unidad = this.tema.unidad.id;
                    id_unidad = '';
                }
                
                let formData = new FormData();
                    formData.append('nombre', this.tema.nombre);
                    formData.append('asignatura', this.tema.asignatura.id);
                    formData.append('unidad', num_unidad);
                    formData.append('id_unidad', id_unidad);
                    formData.append('clasificacion', this.tema.clasificacion);
                    formData.append('idusuario', this.docente);
                    formData.append('estado', 1);
                this.$vs.loading()
                this.$http.post(this.$server_url+'tema', formData)
                .then(res => {
                    this.filtroTemas() // Actualizar lista filtrada por asignatura
                    this.popupAddTema = false
                    this.$vs.loading.close()
                    this.$vs.notify({
                    text:'Tema guardado exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
            },
            openConfirm() {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Confirmar`,
                    text: '¿Está seguro de eliminar este tema y todas las preguntas que contenga?',
                    accept: this.eliminarTema
                })
            },
            getUnidadesAsignatura(){
                let me = this;
                me.unidades_asignatura = []
                return this.$http.get(this.$server_url+'unidades_asignatura/' + me.tema.asignatura.id)
                .then(res => {
                    if( res.data.length > 0 ){
                        me.unidades_asignatura = res.data
                    }else{
                        me.unidades_asignatura = me.unidades
                    }
                    return res;
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            eliminarTema(){
                let me = this;
                let formData = new FormData();
                    formData.append('id_tema', me.id_tema);
                    formData.append('idusuario', me.usuario.idusuario);
                this.$http.post(this.$server_url+'eliminar_tema', formData).then(() => {
                    me.removeItemFromArr(me.temas, me.itemTemas)
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            removeItemFromArr (arr, item) {
                const i = arr.indexOf(item)
                arr.splice(i, 1)
            },
            editarFormulario(item){
                this.asignaturaSelected = {id: item.id_asignatura, label: item.nombreasignatura};
                this.tema.nombre = item.label;//nombre_tema=label
                this.tema.asignatura = {id: item.id_asignatura, label: item.nombreasignatura};
                this.tema.id = item.id;
                this.tema.clasificacion = item.clasificacion;
                this.editarActivo = true;//activa el form editar
                
                // Cargar unidades y luego asignar la unidad correcta
                this.getUnidadesAsignatura().then(() => {
                    // Buscar la unidad en el array de unidades cargadas
                    const unidadEncontrada = this.unidades_asignatura.find(u => {
                        // Si la unidad tiene id (viene de BD), comparar por id
                        if(u.id && item.id_unidad) {
                            return u.id == item.id_unidad;
                        }
                        // Si no tiene id (son las genéricas 1-10), comparar por número de unidad
                        return u.id == item.unidad || u.unidad == item.unidad;
                    });
                    
                    // Si se encuentra la unidad, asignarla; si no, crear objeto genérico
                    if(unidadEncontrada) {
                        this.tema.unidad = unidadEncontrada;
                    } else {
                        this.tema.unidad = {id: item.id_unidad, label: 'Unidad '+item.unidad, unidad: item.unidad};
                    }
                });
            },
            editarTema(item){
                let id_unidad = '';
                let num_unidad = '';
                
                // Si la unidad tiene la propiedad 'unidad' (viene de la BD)
                if(this.tema.unidad.unidad !== undefined && this.tema.unidad.unidad !== null){
                    num_unidad = this.tema.unidad.unidad;
                    id_unidad = this.tema.unidad.id || '';
                } else {
                    // Si la unidad NO tiene la propiedad 'unidad' (es una unidad genérica 1-10)
                    num_unidad = this.tema.unidad.id;
                    id_unidad = '';
                }
                
                let formData = new FormData();
                    formData.append('id', item.id);
                    formData.append('nombre', this.tema.nombre);
                    formData.append('asignatura', this.tema.asignatura.id);
                    formData.append('unidad', num_unidad);
                    formData.append('id_unidad', id_unidad);
                    formData.append('clasificacion', this.tema.clasificacion);
                    formData.append('idusuario', this.docente);
                    formData.append('estado', 1);
                this.$vs.loading()
                this.$http.post(this.$server_url+`tema`, formData).then(res => {
                    const index = this.temas.findIndex(
                        temaBuscar => temaBuscar.id === res.data.id)
                    this.tema[index] = res.data;
                    this.filtroTemas() // Actualizar lista filtrada por asignatura
                    this.editarActivo = false;
                    this.popupEditTema = false
                    this.$vs.loading.close()
                    this.$vs.notify({
                    text:'Tema editado exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})

                });
            },
            // exportarTemas(){
            //     let me = this;
            //     let headers = ['nombre_tema','id_asignatura','unidad','destreza']
            //     let fieldKeys = ['label','id_asignatura','unidad','clasificacion']
            //     let nombrearchivo = 'Temas_'+this.Filtroasignatura.label
            //     me.m_exportTodo(headers,fieldKeys,me.temas,nombrearchivo)
            // },

            exportarTemas() {
              let me = this;
              let headers = ['nombre_tema', 'id_asignatura', 'unidad', 'destreza'];
              let fieldKeys = ['label', 'id_asignatura', 'unidad', 'clasificacion'];
              let nombrearchivo = 'Temas_' + this.Filtroasignatura.label;

              // Hacer copia del array y limpiar campos null/undefined
              let temasProcesados = [...me.temas].map(tema => {
                  return {
                      ...tema,
                      clasificacion: (tema.clasificacion == 'null' || tema.clasificacion === undefined) ? '' : tema.clasificacion
                  };
              });

              me.m_exportTodo(headers, fieldKeys, temasProcesados, nombrearchivo);
            }


        },
    }
</script>
<style scoped>
/* Asegurar que los dropdowns de v-select se muestren correctamente */
::v-deep .vs__dropdown-menu {
    z-index: 9999 !important;
    max-height: 300px;
}

/* Para el modal popup */
::v-deep .popup-example {
    overflow: visible !important;
}

::v-deep .vs-popup {
    overflow: visible !important;
}

::v-deep .vs-popup--content {
    overflow: visible !important;
}
</style>
