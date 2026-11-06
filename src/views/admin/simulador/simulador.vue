<template>
    <div v-if="usuario.id_group == '1'">
        <vs-card>
            <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0px 0px 20px;">
                <vs-button color="primary" @click="abrirModalCrear()" type="gradient" icon="library_add">Crear Simulador</vs-button>
                <vs-button color="success" @click="getSimuladores()" type="border" icon="refresh">Recargar</vs-button>
            </div>

            <div v-if="simuladores.length > 0 ">
                <!-- Filtro de estado / Resumen -->
                <div class="sim-filter-bar">
                    <label class="sim-radio" :class="{ 'sim-radio--active sim-radio--activo': filtroEstado === '1' }">
                        <input type="radio" v-model="filtroEstado" value="1" />
                        <span>Activos</span>
                        <span class="sim-radio__count">{{ simuladores.filter(s => s.estado == '1').length }}</span>
                    </label>
                    <label class="sim-radio" :class="{ 'sim-radio--active sim-radio--inactivo': filtroEstado === '0' }">
                        <input type="radio" v-model="filtroEstado" value="0" />
                        <span>Inactivos</span>
                        <span class="sim-radio__count">{{ simuladores.filter(s => s.estado != '1').length }}</span>
                    </label>
                    <label class="sim-radio" :class="{ 'sim-radio--active sim-radio--todos': filtroEstado === '' }">
                        <input type="radio" v-model="filtroEstado" value="" />
                        <span>Todos</span>
                        <span class="sim-radio__count">{{ simuladores.length }}</span>
                    </label>
                </div>
                <br/>

                <vs-table max-items="10" stripe search pagination :data="simuladoresFiltrados">
                    <template slot="thead">
                        <vs-th sort-key="index" style="width:50px;">#</vs-th>
                        <vs-th sort-key="nombreasignatura">Asignatura</vs-th>
                        <vs-th sort-key="nombre">Nombre / Descripción</vs-th>
                        <vs-th>Unidades</vs-th>
                        <vs-th>Enlaces</vs-th>
                        <vs-th sort-key="estado">Estado</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                            <!-- # -->
                            <vs-td>
                                <span class="sim-badge sim-badge--num">{{ indextr + 1 }}</span>
                            </vs-td>

                            <!-- Asignatura -->
                            <vs-td>
                                <span class="sim-asignatura">{{ data[indextr].nombreasignatura }}</span>
                            </vs-td>

                            <!-- Nombre y Descripción -->
                            <vs-td>
                                <div style="max-width: 300px;">
                                    <strong style="display: block; margin-bottom: 4px;">{{ data[indextr].nombre }}</strong>
                                    <span style="display: block; font-size: 0.85rem; color: #666;">{{ data[indextr].descripcion }}</span>
                                </div>
                            </vs-td>

                            <!-- Unidades -->
                            <vs-td>
                                <template v-if="tr.unidades_ids && tr.unidades_ids !== '' && tr.unidades_ids !== 'null'">
                                    <div style="max-width: 250px;">
                                        <div v-for="(nombre, idx) in tr.unidades_nombres" :key="idx" style="margin: 2px 0;">
                                            <span class="sim-badge sim-badge--units" style="display: inline-block; margin: 2px 0; font-size: 0.7rem;">
                                                {{ nombre }}
                                            </span>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <span class="sim-badge sim-badge--all">Ninguna</span>
                                </template>
                            </vs-td>

                            <!-- Enlaces y Tipo -->
                            <vs-td>
                                <div class="sim-links">
                                    <a v-if="tr.tipo_ruta == '2' || tr.tipo_ruta == 2"
                                       href="#" @click.prevent="abrirSimuladorEmbebido(tr.link)"
                                       class="sim-link sim-link--prolipa">
                                        <i class="feather icon-eye" style="font-size:12px;"></i> Simulador
                                    </a>
                                    <a v-else :href="tr.link" target="_blank" class="sim-link sim-link--primary">
                                        <i class="feather icon-link" style="font-size:12px;"></i> Simulador
                                    </a>
                                    
                                    <a v-if="tr.link_tutorial && tr.link_tutorial !== 'null' && tr.link_tutorial !== ''"
                                       :href="tr.link_tutorial" target="_blank" class="sim-link sim-link--primary" style="margin-top: 4px;">
                                        <i class="feather icon-play-circle" style="font-size:12px;"></i> Tutorial
                                    </a>
                                    
                                    <p style="margin-top: 6px; text-align: center; font-size: 0.85rem; color: #666;">
                                        <strong>Tipo enlace: </strong>
                                        <span v-if="tr.tipo_ruta == '2' || tr.tipo_ruta == 2">Prolipa</span>
                                        <span v-else>Externa</span>
                                    </p>
                                </div>
                            </vs-td>

                            <!-- Estado -->
                            <vs-td style="text-align:center;">
                                <span v-if="tr.estado == '1'" class="sim-badge sim-badge--activo">Activo</span>
                                <span v-else class="sim-badge sim-badge--inactivo">Inactivo</span>
                            </vs-td>

                            <!-- Acciones -->
                            <vs-td>
                                <div style="display:flex; align-items:center; gap:6px;">
                                    <vx-tooltip text="Editar simulador" position="top" color="warning">
                                        <vs-button size="small" color="warning" @click="update=true; openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="tr.estado == '1'" text="Desactivar simulador" position="top" color="danger">
                                        <vs-button size="small" color="danger" @click="openConfirm(data[indextr].simulador_id, 0)" type="filled" icon-pack="feather" icon="icon-x-square"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip v-else text="Activar simulador" position="top" color="success">
                                        <vs-button size="small" color="success" @click="openConfirm(data[indextr].simulador_id, 1)" type="filled" icon-pack="feather" icon="icon-check"></vs-button>
                                    </vx-tooltip>
                                </div>
                            </vs-td>

                        </vs-tr>
                    </template>
                </vs-table>
            </div>

            <div v-else class="sim-empty">
                <i class="feather icon-inbox" style="font-size:48px; color:#c0c0c0;"></i>
                <p>No existen simuladores aún.</p>
                <small>Haz clic en <strong>Crear Simulador</strong> para agregar uno.</small>
            </div>

        </vs-card>

        <!--PARA LOS MODALES -->
          <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Simulador" :active.sync="popupAddSimulador">
               
                Asignatura:
        
                <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="nombreasignatura" class="w-full" v-model="simulador.asignatura_id" />
                <br/>
                
                <div v-if="unidades.length > 0">
                    Unidades (opcional):
                    <v-select 
                        :options="unidades" 
                        :reduce="unidad => unidad.id_unidad_libro" 
                        label="label" 
                        class="w-full" 
                        v-model="simulador.unidades_ids"
                        multiple
                        placeholder="Seleccione unidades"
                    />
                    <!-- <small style="color: #999;">Si no selecciona unidades, el simulador estará disponible para todas</small> -->
                    <br/>
                </div>
                
                <vs-input class="inputx mb-3 w-full" label="Nombre simulador" v-model="simulador.nombre" />
                <br/>
                <vs-textarea counter="300" style="width:100%;" label="Descripción" :counter-danger.sync="counterDanger" v-model="simulador.descripcion" />
                <div style="margin: 15px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Tipo de Ruta:</label>
                    <vs-radio v-model="tipo_ruta" vs-name="radiostipo_ruta" vs-value="1" style="margin-right: 20px;">Ruta Externa</vs-radio>
                    <vs-radio v-model="tipo_ruta" vs-name="radiostipo_ruta" vs-value="2">Ruta Prolipa (Embebido)</vs-radio>
                </div>
                
                <vs-input class="inputx mb-3 w-full" :label="tipo_ruta == '2' ? 'Ruta del archivo' : 'Link'" v-model="simulador.link" />
                <small v-if="tipo_ruta == '2'" style="color: #999;">Ejemplo: archivo.pdf o carpeta/archivo.html</small>
                
                <vs-input class="inputx mb-3 w-full" label="Tutorial" v-model="simulador.link_tutorial" />
                <br><br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarSimulador()" type="gradient" >Guardar</vs-button>
            </vs-popup>
        </div>

       <!-- Modal Editar-->
        <div class="demo-alignment">

            <vs-popup classContent="popup-example" title="Editar Simulador" :active.sync="popupEditSimulador">
                Asignatura:
        
                <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="nombreasignatura" class="w-full" v-model="simulador.asignatura_id" />
                <br/>
                
                <div v-if="unidades.length > 0">
                    Unidades (opcional):
                    <v-select 
                        :options="unidades" 
                        :reduce="unidad => unidad.id_unidad_libro" 
                        label="label" 
                        class="w-full" 
                        v-model="simulador.unidades_ids"
                        multiple
                        placeholder="Seleccione unidades"
                    />
                    <small style="color: #999;">Si no selecciona unidades, el simulador estará disponible para todas</small>
                    <br/>
                </div>
                
                <vs-input class="inputx mb-3 w-full" label="Nombre Simulador" v-model="simulador.nombre" />
                <vs-textarea counter="300" style="width:100%;" label="Descripción" :counter-danger.sync="counterDanger" v-model="simulador.descripcion" />
                
                <div style="margin: 15px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Tipo de Ruta:</label>
                    <vs-radio v-model="tipo_ruta" vs-name="radiostipo_ruta2" vs-value="1" style="margin-right: 20px;">Ruta Externa</vs-radio>
                    <vs-radio v-model="tipo_ruta" vs-name="radiostipo_ruta2" vs-value="2">Ruta Prolipa (Embebido)</vs-radio>
                </div>
                
                <vs-input class="inputx mb-3 w-full" :label="tipo_ruta == '2' ? 'Ruta del archivo' : 'Link'" v-model="simulador.link" />
                <small v-if="tipo_ruta == '2'" style="color: #999;">Ejemplo: archivo.pdf o carpeta/archivo.html</small>
                
                <vs-input class="inputx mb-3 w-full" label="Tutorial" v-model="simulador.link_tutorial" />
                 <br><br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarSimulador()" type="gradient" >Actualizar</vs-button>
            </vs-popup>
        </div>
    </div>
</template>

<script>
import vSelect from 'vue-select'
export default {
    data(){
        return{
            id:0,
            counterDanger: false,
            simuladores:[],
            asignaturas:[],
            unidades:[],
            popupAddSimulador:false,
            simulador:{
                asignatura_id:'',
                nombre:'',
                descripcion:'',
                link:'',
                link_tutorial:'',
                estado:'',
                unidades_ids:[],
            },
            popupEditSimulador:false,
            update:false,
            estado:'',
            usuario:[],
            filtroEstado: '1',
            tipo_ruta: 1, // "1" = externa, "2" = prolipa
        }
    },

    components: {
        'v-select': vSelect,
                
     },

    computed: {
        simuladoresFiltrados() {
            if (this.filtroEstado === '') return this.simuladores;
            return this.simuladores.filter(s => s.estado == this.filtroEstado);
        }
    },

    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getSimuladores();
        me.getAsignaturas();
    },
    watch: {
        'simulador.asignatura_id': function(newVal) {
            if(newVal && newVal.idlibro) {
                this.getUnidades(newVal.idlibro);
            } else {
                this.unidades = [];
                this.simulador.unidades_ids = [];
            }
        }
    },
    methods:{

        //para obtener el listado de las areas
        getSimuladores() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'simulador')
                .then(function (res) {
                    me.simuladores = res.data.simulador;
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        //para obtener las unidades por libro
        getUnidades(id_libro) {
            let me = this;
            this.$http.get(this.$server_url+'unidadesX_Libro/'+id_libro)
                .then(function (res) {
                    // Formatear los datos para el v-select
                    me.unidades = res.data.map(unidad => ({
                        id_unidad_libro: unidad.id_unidad_libro,
                        unidad: unidad.unidad,
                        nombre_unidad: unidad.nombre_unidad,
                        label: unidad.unidad + ' - ' + unidad.nombre_unidad
                    }));
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.unidades = [];
                })
        },

          //para obtener el listado de las areas
        getAsignaturas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'simulador')
                .then(function (res) {
                    me.asignaturas = res.data.asignaturas;
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        guardarSimulador(){
            let me = this;
          
                //datos que se obtienen de los inputs
                if(me.simulador.nombre.length < 4){
                    this.$vs.notify({
                        text:'El nombre debe tener minimo 4 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }

                if(me.simulador.descripcion.length < 4){
                    this.$vs.notify({
                        text:'La descripcion debe tener minimo 4 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }

                if(me.simulador.link.length < 8){
                    this.$vs.notify({
                        text:'El link debe tener minimo 4 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }

                if(me.simulador.nombre.length > 200){
                    this.$vs.notify({
                        text:'El nombre  debe tener maximo 200 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }

                if(me.simulador.link_tutorial !==null){
                    if(me.simulador.link_tutorial.length > 200){
                        this.$vs.notify({
                            text:'El link del tutorial  debe tener maximo 200 caracteres',
                            color:'warning',
                            iconPack: 'feather',
                            icon:'icon-check'})
                        return false;
                     }
                }
              

                  if(me.simulador.descripcion.length > 300){
                     this.$vs.notify({
                        text:'La descripcion debe tener maximo 300 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                         icon:'icon-check'})
                    return false;
                }

                 if(me.simulador.link.length > 200){
                     this.$vs.notify({
                        text:'El link debe tener maximo 200 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                         icon:'icon-check'})
                    return false;
                }
                
                // Validar que si es tipo Externa (1), NO contenga data.prolipadigital.com.ec
                if(me.tipo_ruta == "1" && me.simulador.link.includes('data.prolipadigital.com.ec')){
                    this.$vs.notify({
                        text:'Para Ruta Externa no puede usar URLs de data.prolipadigital.com.ec. Cambie a Ruta Prolipa o use otra URL externa.',
                        color:'danger',
                        iconPack: 'feather',
                        time:6000,
                        icon:'icon-alert-circle'})
                    return false;
                }
                
                // Validar que el tutorial NO contenga data.prolipadigital.com.ec
                if(me.simulador.link_tutorial && me.simulador.link_tutorial.includes('data.prolipadigital.com.ec')){
                    this.$vs.notify({
                        text:'El tutorial no puede usar URLs de data.prolipadigital.com.ec. Use un enlace externo como YouTube.',
                        color:'danger',
                        iconPack: 'feather',
                        time:6000,
                        icon:'icon-alert-circle'})
                    return false;
                }
                
                let formData = new FormData();

                if(me.update){
                    formData.append('simulador_id',      me.id);
                    formData.append('asignatura_id',     me.simulador.asignatura_id.idasignatura);
                    formData.append('nombre',            me.simulador.nombre);
                    formData.append('descripcion',       me.simulador.descripcion);
                    formData.append('link',              me.simulador.link);
                    formData.append('link_tutorial',     me.simulador.link_tutorial);
                    formData.append('tipo_ruta',         me.tipo_ruta);
                    
                    // Agregar unidades seleccionadas
                    if(me.simulador.unidades_ids && me.simulador.unidades_ids.length > 0){
                        me.simulador.unidades_ids.forEach((unidad_id, index) => {
                            formData.append('unidades_ids['+index+']', unidad_id);
                        });
                    }
                    
                }else{
                    formData.append('asignatura_id',     me.simulador.asignatura_id.idasignatura);
                    formData.append('nombre',            me.simulador.nombre);
                    formData.append('descripcion',       me.simulador.descripcion);
                    formData.append('link',              me.simulador.link);
                    formData.append('link_tutorial',     me.simulador.link_tutorial);
                    formData.append('tipo_ruta',         me.tipo_ruta);
                    
                    // Agregar unidades seleccionadas
                    if(me.simulador.unidades_ids && me.simulador.unidades_ids.length > 0){
                        me.simulador.unidades_ids.forEach((unidad_id, index) => {
                            formData.append('unidades_ids['+index+']', unidad_id);
                        });
                    }
                }
                

          
                me.$vs.loading();
                this.$http.post(this.$server_url+'simulador', formData)
                    .then(function (res) {
                        me.$vs.notify({
                            text: res.data,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.getSimuladores();
                        me.popupAddSimulador = false;
                        me.popupEditSimulador = false;
                        me.update = false;
                        me.limpiar();
                    })
                .catch(function (error) {})
        },
       //para editar los campos
        openModalEditar(data={}){
            let me = this;
           
            me.popupEditSimulador = true;
            
            //llenar la data en los campos
             me.id = data.simulador_id;
             me.simulador.nombre = data.nombre;
             me.simulador.descripcion = data.descripcion;
             me.simulador.link = data.link;
             me.simulador.link_tutorial = data.link_tutorial;
             // Convertir tipo_ruta a string
             me.tipo_ruta = data.tipo_ruta ? String(data.tipo_ruta) : "1";
             me.simulador.asignatura_id = {idasignatura:data.asignatura_id, nombreasignatura:data.nombreasignatura, idlibro:data.idlibro};
             
             // Cargar unidades si hay un libro
             if(data.idlibro){
                 me.getUnidades(data.idlibro);
             }
             
             // Convertir unidades_ids de string a array
             if(data.unidades_ids){
                 me.simulador.unidades_ids = data.unidades_ids.split(',').map(id => parseInt(id));
             } else {
                 me.simulador.unidades_ids = [];
             }
             
             console.log('Tipo ruta cargado:', me.tipo_ruta, typeof me.tipo_ruta);
 
        },

        //para abrir el popup de confimacion para eliminar
        openConfirm(simulador_id,estado){
            let me = this;
            me.id = simulador_id;
            me.estado = estado;
            me.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmacion`,
                text: 'Estás seguro de cambiar de estado?.',
                accept:me.cambiarEstado
            })
        },
        cambiarEstado(){
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'simulador?cambiarEstado=yes&simulador_id='+me.id+'&estado='+me.estado)
                .then(function (res) {
                    me.getSimuladores();
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Estado cambiado con exito',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        abrirSimuladorEmbebido(url) {
            // Guardar la URL en localStorage
            localStorage.setItem('simulador_url', url);
            // Abrir en nueva ventana
            window.open('/admin/simulador/ruta', '_blank');
        },

        limpiar(){
            let me = this;
            me.simulador.asignatura_id ='';
            me.simulador.nombre ='';
            me.simulador.descripcion ='';
            me.simulador.link ='';
            me.simulador.link_tutorial = '';
            me.simulador.estado ='';
            me.simulador.unidades_ids = [];
            // me.tipo_ruta = 1;
            me.unidades = [];
        },
        
        abrirModalCrear(){
            let me = this;
            me.limpiar();
            me.update = false;
            me.popupAddSimulador = true;
            
            // Forzar la selección del radio después de que el DOM se actualice
            me.$nextTick(() => {
                setTimeout(() => {
                    me.tipo_ruta = "1";
                }, 100);
            });
        }
    }
}
</script>

<style scoped>
/* Las estadísticas se integraron en el filtro para ahorrar espacio */

/* ── Badges genéricos ─────────────────────────────── */
.sim-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
}

.sim-badge--num     { background:#e8eaf6; color:#3949ab; }
.sim-badge--units   { background:#e3f2fd; color:#1565c0; }
.sim-badge--all     { background:#e8f5e9; color:#2e7d32; }
.sim-badge--prolipa { background:#f3e5f5; color:#7b1fa2; }
.sim-badge--externa { background:#fff3e0; color:#e65100; }
.sim-badge--activo  { background:#e8f5e9; color:#2e7d32; }
.sim-badge--inactivo{ background:#ffebee; color:#c62828; }

.sim-badge small { font-size: 0.65rem; font-weight: 400; }

/* ── Asignatura ───────────────────────────────────── */
.sim-asignatura {
    font-weight: 500;
    color: #444;
}

/* ── Descripción truncada ─────────────────────────── */
.sim-desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 0.85rem;
    color: #666;
    max-width: 200px;
}

/* ── Links ────────────────────────────────────────── */
.sim-links {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.sim-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none;
    transition: opacity .15s ease;
    white-space: nowrap;
}
.sim-link:hover { opacity: .75; text-decoration: none; }
.sim-link--primary  { background: #e3f2fd; color: #1565c0; }
.sim-link--tutorial { background: #f3e5f5; color: #7b1fa2; }
.sim-link--prolipa  { background: #f3e5f5; color: #7b1fa2; }

/* ── Filtro radios ────────────────────────────────── */
.sim-filter-bar {
    display: flex;
    gap: 8px;
    margin: 16px 0 0 20px;
}
.sim-radio {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    border-radius: 20px;
    border: 1.5px solid #dde3f0;
    background: #f7f9ff;
    font-size: 0.82rem;
    font-weight: 600;
    color: #8a96b0;
    cursor: pointer;
    transition: all .15s ease;
    user-select: none;
}
.sim-radio input[type="radio"] { display: none; }
.sim-radio:hover { border-color: #aab4d4; }
.sim-radio--active { border-width: 1.5px; }

.sim-radio__count {
    font-size: 0.75rem;
    font-weight: 700;
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 2px;
    transition: background .15s ease;
}

/* Colores de selección activa */
.sim-radio--activo  { background: #edfaf4; border-color: #28a745; color: #28a745; }
.sim-radio--activo .sim-radio__count { background: rgba(40, 167, 69, 0.15); color: #28a745; }

.sim-radio--inactivo{ background: #fff4f4; border-color: #dc3545; color: #dc3545; }
.sim-radio--inactivo .sim-radio__count { background: rgba(220, 53, 69, 0.15); color: #dc3545; }

.sim-radio--todos   { background: #f0f4ff; border-color: #3949ab; color: #3949ab; }
.sim-radio--todos .sim-radio__count { background: rgba(57, 73, 171, 0.15); color: #3949ab; }

/* ── Empty state ──────────────────────────────────── */
.sim-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    color: #aaa;
    gap: 8px;
}
.sim-empty p    { margin: 0; font-size: 1rem; font-weight: 500; color: #888; }
.sim-empty small{ font-size: 0.85rem; color: #bbb; }
</style>
