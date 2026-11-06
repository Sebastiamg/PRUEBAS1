<template>
<div>
    <!--FORMULARIO INFORMACION PAGO-->
    <div>
        <vs-row vs-align="center">
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="8" vs-sm="8" vs-xs="8">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-textarea style="width:100%;" counter="400" label="Observación" ref="observacionRegresarAPendiente" :class="classvalidar_observacionRegresarAPendiente" v-model="observacionRegresarAPendiente" />
                        <!-- <vs-input label="Observación (Obligatorio)" placeholder="Observación" class="w-full" icon="mode_edit" ref="observacionRegresarAPendiente" :class="classvalidar_observacionRegresarAPendiente" v-model="observacionRegresarAPendiente" /> -->
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br>
        <div v-if="datadocumento.est_ven_codigo == 1">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminarMovimientoNO()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </div>
        <div v-else>
            <!--El documento ya esta empacado-->
            <p class="text-center font-bold">Solo despachado se puede regresar a pendiente</p>
        </div>
    </div>
</div>
</template>

<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
    components: {
        vSelect,
        flatPickr,
    },
    data() {
        return {
            observacionRegresarAPendiente: '',
            classvalidar_observacionRegresarAPendiente: '',
        }
    },
    props: {
        datadocumento: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this;
        // this.verificarseleccion()
        console.log(this.datadocumento, "verifiacionprop1");
    },
    methods: {
        alert_observacionRegresarAPendiente() {
            let me = this;
            const focus_observacionRegresarAPendiente = this.$refs.observacionRegresarAPendiente.$el.querySelector('textarea');
            focus_observacionRegresarAPendiente.focus();
            this.classvalidar_observacionRegresarAPendiente = 'stylevalidar';
            me.$vs.notify({
                text: 'Escriba una observación antes de cambiar a pendiente.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                this.classvalidar_observacionRegresarAPendiente = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        getEliminarMovimientoNO() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            const usuarioEdit = ' | Usuario Editor: ' + usuarioObjeto.idusuario + '(' + usuarioObjeto.nombres +' '+ usuarioObjeto.apellidos + ')';
            if (me.observacionRegresarAPendiente.trim().length <= 1 || me.observacionRegresarAPendiente == null) {
                this.alert_observacionRegresarAPendiente();
                return
            }
            let datos = {
                "ven_codigo": me.datadocumento.ven_codigo,
                "id_empresa": me.datadocumento.id_empresa,
                "observacionRegresarAPendiente": 'Observación: '+ me.observacionRegresarAPendiente + '' + usuarioEdit,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Regresar_A_Pendiente_Documento", datos)
                .then(data => {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'El documento se regreso a pendiente con éxito.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$emit('change', {
                        verificacionemitsaveandedit: 1
                    });
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    if(error.response.data.error){
                        me.$vs.notify({
                            text: error.response.data.error,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    }else{
                      me.$vs.notify({
                        text: 'El documento no se pudo regresar a pendiente.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                      })
                    }

                })
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        },
    }
}
</script>

<style scoped>
.stylevalidar {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}
</style>
