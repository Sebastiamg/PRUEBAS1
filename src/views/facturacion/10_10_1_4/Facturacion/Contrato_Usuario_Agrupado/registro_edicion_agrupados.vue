<template>
<vx-card fixed-height="true">
    <vs-row>
        <!-- {{ nuevoarray }} -->
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información del Agrupado</b></vs-col>
        <br>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-w="10">
                    <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                    <font style="font-size: 11.5px">&nbsp;Cédula o Nombre Usuario con Perfil Librería</font><br>
                    <v-select :options="UsuariosLibrerias" :reduce="UsuariosLibrerias => UsuariosLibrerias.idusuario" label="datosbusqueda" class="w-full h-100" placeholder="--Seleccione--" v-model="nuevoarray.idusuario" />
                </vs-col>
            </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-w="10">
                  ee {{ nuevoarray.ca_id }}
                    <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                    <font style="font-size: 11.5px">&nbsp;Código o Nombre del Agrupado</font><br>
                    <v-select :options="ContratoAgrupacion" :disabled="disabledCodigoAgrupado" :reduce="ContratoAgrupacion => ContratoAgrupacion.ca_id" label="datoscontagrupados" class="w-full h-100" placeholder="--Seleccione--" v-model="nuevoarray.ca_id" />
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevoeditarContUserAgrupados()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <br>
    <br>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
export default {
    data() {
        return {
            Verificacionconteo: '',
            UsuariosLibrerias: [],
            ContratoAgrupacion: [],
            ContUserAgrupacion_sinfiltro: [],
            fcu_id: 0,
            nuevoarray: [{
                idusuario: 0,
                ca_id: 0,
            }],
            disabledCodigoAgrupado:false,
            //showAgregarNuevo: false,
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        verificarcrear_actualizar: {
            type: String,
            default: '',
        },
        tabContUserAgrupacion: {
            type: Object,
            default: function () {
                return {}
            }
        },
        desdeAgrupado:{
          type:Number,
          default:0
        },
        sendPuntos:{
          type:[Object,String],
          default:function(){
            return {}
          }
        }
    },
    mounted() {
        let me = this;
        this.MetodosdeInicio();
        if (me.verificarcrear_actualizar === 'create') {
            me.nuevoarray = [];
            // me.getNuevoContUserAgrupacion();
        } else if (me.verificarcrear_actualizar === 'update') {
            // console.log("Entro en actualizar");
            me.nuevoarray = me.tabContUserAgrupacion;
        } else {
            console.log("Validación no controlada");
        }
        if(me.desdeAgrupado == 1){
          me.nuevoarray.ca_id = me.sendPuntos.ca_id
          me.disabledCodigoAgrupado = true
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        MetodosdeInicio() {
            this.getUsuariosLibrerias();
            this.getContratoAgrupado();
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
        getUsuariosLibrerias() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetUsuarios_PerfilLibrerias')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.UsuariosLibrerias = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getContratoAgrupado() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_Contratosagrupados_Completo')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.ContratoAgrupacion = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        guardarnuevoeditarContUserAgrupados() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (this.nuevoarray.ca_id === '' || this.nuevoarray.ca_id === null) {
                me.$vs.notify({
                    text: 'Seleccione el agrupado antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.nuevoarray.idusuario === '' || this.nuevoarray.idusuario === null) {
                me.$vs.notify({
                    text: 'Seleccione el usuario antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            me.$vs.loading()
            if (me.verificarcrear_actualizar === 'create') {
                console.log("entro a crear");
                let datos = {
                    "ca_id": this.nuevoarray.ca_id,
                    "idusuario": this.nuevoarray.idusuario,
                    "user_created": usuarioObjeto.idusuario,
                }
                //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                this.$http.post(this.$server_url + 'Post_Registrar_modificar_contrato_usuario', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        // this.getContUserAgrupacionParametro();
                        me.$vs.notify({
                            text: 'Agrupación guardada con exito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1
                        });
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                        if (error.response && error.response.status === 500 && error.response.data.message.includes('Duplicate entry')) {
                            // Capturamos el mensaje de error específico de duplicación
                            let errorMessage = 'Ya existe un registro con esa agrupación.';

                            // Notificamos al usuario del error
                            me.$vs.notify({
                                text: errorMessage,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        } else {
                            console.log(error + ' error');
                        }
                    });
            } else if (me.verificarcrear_actualizar === 'update') {
                console.log("entro a actuyalizar");
                let datos = {
                    "fcu_id": this.nuevoarray.fcu_id,
                    "ca_id": this.nuevoarray.ca_id,
                    "idusuario": this.nuevoarray.idusuario,
                }
                //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                this.$http.post(this.$server_url + 'Post_Registrar_modificar_contrato_usuario', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        // this.getContUserAgrupacionParametro();
                        me.$vs.notify({
                            text: 'Agrupación editada con exito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1
                        });
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                        if (error.response && error.response.status === 500 && error.response.data.message.includes('Duplicate entry')) {
                            // Capturamos el mensaje de error específico de duplicación
                            let errorMessage = 'Ya existe un registro con esa agrupación.';

                            // Notificamos al usuario del error
                            me.$vs.notify({
                                text: errorMessage,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        } else {
                            console.log(error + ' error');
                        }
                    });
            } else {
                console.log("Guardado no controlado");
            }
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        },
    },
};
</script>
