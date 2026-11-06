<template>
<vx-card fixed-height="true">
    <!-- <div>
        <button @click="startFullTour">Iniciar Tour Completo</button>
        <div class="page-header">Encabezado de la página</div>
        <div class="top-nav">Barra de navegación</div>
        <div class="sidebar">Barra lateral</div>
        <div class="footer">Pie de página</div>
    </div> -->
    <vs-row>
        <vs-divider>Información</vs-divider>
        <vs-row vs-align="center">
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="8" vs-sm="8" vs-xs="8">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Nombre" placeholder="Nombre" class="w-full" icon="mode_edit" ref="arp_nombre" :class="classvalidar_arp_nombre" v-model="nuevoarray.arp_nombre" @input="actualizarValor" @keypress="validarkey_arp_nombre($event)" @paste="validarnopegar($event)" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="8" vs-sm="8" vs-xs="8">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-tooltip style="display: inline; margin-top: 10px;" align="center" text="Valor sacado del nombre." position="bottom" color="warning" class="w-full">
                            <template>‎</template>
                            <div><b>Valor: </b>{{ nuevoarray.arp_valor }}</div>
                        </vs-tooltip>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevoeditarPorcentaje()" type="relief">Guardar</vs-button>&emsp;
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
import {
    driver
} from "driver.js";
// import "driver.js/dist/driver.css";
export default {
    data() {
        return {
            Verificacionconteo: '',
            nuevoarray: {},
            filtrocodnombre: '',
            encontroresultados: 0,
            InstitucionesBusqueda: [],
            classvalidar_arp_nombre: '',
            classvalidar_arp_valor: '',
            datosPost: [],
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
        tabPorcentaje: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this;
        if (me.verificarcrear_actualizar === 'create') {
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            me.nuevoarray = {
                arp_nombre: '',
                user_created: usuarioObjeto.idusuario,
            };
            // me.getNuevoContUserAgrupacion();
        } else if (me.verificarcrear_actualizar === 'update') {
            // console.log("Entro en actualizar");
            me.nuevoarray = me.tabPorcentaje;
        } else {
            console.log("Validación no controlada");
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        validarkey_arp_nombre(event) {
            let valorporcentaje = this.nuevoarray.arp_nombre;
            // Verificar si la tecla presionada es un número comas y puntos.
            if (!/[\d.,%\s]/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Reemplazar comas por puntos solo si hay comas en la cadena
            if (valorporcentaje.includes(',')) {
                valorporcentaje = valorporcentaje.replace(',', '.');
                this.nuevoarray.arp_nombre = valorporcentaje;
            }
        },
        validarnopegar(event) {
            // Obtener el texto pegado
            let pastedText = (event.clipboardData || window.clipboardData).getData('text');

            // Verificar si el texto pegado contiene solo números
            if (!/^\d+$/.test(pastedText)) {
                event.preventDefault();
                return;
            }
        },
        alert_arp_nombre() {
            const focus_arp_nombre = this.$refs.arp_nombre.$el.querySelector('input');
            focus_arp_nombre.focus();
            this.classvalidar_arp_nombre = 'stylevalidar';
            me.$vs.notify({
                text: 'Escriba un nombre antes de guardar',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                this.classvalidar_arp_nombre = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        alert_arp_valor() {
            const focus_arp_valor = this.$refs.arp_valor.$el.querySelector('input');
            focus_arp_valor.focus();
            this.classvalidar_arp_valor = 'stylevalidar';
            me.$vs.notify({
                text: 'Escriba un nombre antes de guardar',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                this.classvalidar_arp_valor = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        guardarnuevoeditarPorcentaje() {
            let me = this;
            me.datosPost = [];
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (this.nuevoarray.arp_nombre === '' || this.nuevoarray.arp_nombre === null || this.nuevoarray.arp_nombre === 'undefined') {
                this.alert_arp_nombre();
                return;
            }

            if (me.verificarcrear_actualizar == 'create') {
                let datos = {
                    "action": 'Post_Registrar_modificar_Porcentaje',
                    "arp_nombre": this.nuevoarray.arp_nombre,
                    "arp_valor": this.nuevoarray.arp_valor,
                    "user_created": this.nuevoarray.user_created,
                }
                me.datosPost = datos
            } else if (me.verificarcrear_actualizar == 'update') {
                let datos = {
                    "action": 'Post_Registrar_modificar_Porcentaje',
                    "arp_id": this.nuevoarray.arp_id,
                    "arp_nombre": this.nuevoarray.arp_nombre,
                    "arp_valor": this.nuevoarray.arp_valor,
                }
                me.datosPost = datos
            } else {
                console.log("Guardado no controlado");
                return
            }
            me.$vs.loading();
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_AbonoRetencionPorcentaje', me.datosPost)
                .then(res => {
                    me.$vs.loading.close()
                    if (me.verificarcrear_actualizar == 'create') {
                        me.$vs.notify({
                            text: 'Porcentaje guardado con éxito.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    } else if (me.verificarcrear_actualizar == 'update') {
                        me.$vs.notify({
                            text: 'Porcentaje editado con éxito.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    } else {
                        console.log("Guardado no controlado");
                    }
                    me.$emit('change', {
                        verificacionemitsaveandedit: 1
                    });
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                });
        },
        actualizarValor() {
            // Extraer el número del valor ingresado en `arp_nombre`
            const match = this.nuevoarray.arp_nombre.match(/[\d.]+/); // Busca números o decimales
            this.nuevoarray.arp_valor = match ? parseFloat(match[0]) : ''; // Actualiza el valor de `arp_valor`
        },
        // startFullTour() {
        //     const steps = [{
        //             element: '.page-header',
        //             popover: {
        //                 title: 'Encabezado de la Página',
        //                 description: 'Aquí puedes ver el encabezado de la página.',
        //                 progressText: `{{current}} de {{total}}`
        //             },
        //         },
        //         {
        //             element: '.top-nav',
        //             popover: {
        //                 title: 'Barra de Navegación',
        //                 description: 'Este es el menú principal de navegación.',
        //                 progressText: `{{current}} de {{total}}`
        //             },
        //         },
        //         {
        //             element: '.sidebar',
        //             popover: {
        //                 title: 'Barra Lateral',
        //                 description: 'Aquí puedes ver la barra lateral con las opciones.',
        //                 progressText: `{{current}} de {{total}}`
        //             },
        //         },
        //         {
        //             element: '.footer',
        //             popover: {
        //                 title: 'Pie de Página',
        //                 description: 'Finalmente, este es el pie de página.',
        //                 progressText: `{{current}} de {{total}}`
        //             },
        //         },
        //         {
        //             element: '.nuevaaaa',
        //             popover: {
        //                 title: 'Nueva Sección',
        //                 description: 'Descripción de la nueva sección.',
        //                 progressText: `{{current}} de {{total}}`
        //             },
        //         },
        //         {
        //             element: '.nuevaaaa2',
        //             popover: {
        //                 title: 'Otra Nueva Sección',
        //                 description: 'Descripción de otra nueva sección.',
        //                 side: 'top',
        //                 align: 'start',
        //                 progressText: `{{current}} de {{total}}`
        //             },
        //         },
        //     ];

        //     console.log(`Número de pasos: ${steps.length}`); // Cuenta los pasos antes de inicializar el tour

        //     const driverObj = driver({
        //         showProgress: true,
        //         showButtons: ['next', 'previous', 'close'],
        //         nextBtnText: 'Siguiente →',
        //         prevBtnText: '← Anterior',
        //         doneBtnText: 'Finalizar',
        //         steps: steps,
        //     });

        //     // Inicia el tour con los pasos definidos
        //     driverObj.drive();
        // },
        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        },
    },
};
</script>

<style scoped>
.stylevalidar {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

.page-header,
.top-nav,
.sidebar,
.footer {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    text-align: center;
}
</style>
