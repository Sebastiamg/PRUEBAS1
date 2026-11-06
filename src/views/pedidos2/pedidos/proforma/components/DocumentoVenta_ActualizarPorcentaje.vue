<template>
<vx-card fixed-height="true">
    <!-- {{ tr_data }} -->
    <vs-row>
        <!-- <vs-divider>Información</vs-divider> -->
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <div align="center"><b>La actualización de este porcentaje modificará los valores de la tabla f_proforma y f_venta.</b></div>
            <vs-row vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="4">
                    <vs-input label="Porcentaje" placeholder="Porcentaje" class="w-full" icon="mode_edit" v-model="actualizar_porcentaje" maxlength="3" @paste="validarnopegar($event)" ref="actualizar_porcentaje" :class="classvalidar_actualizar_porcentaje" @keypress="validarkey_actualizar_porcentaje($event)" />
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="ActualizarPorcentaje()" type="relief">Actualizar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <br>
    <br>
</vx-card>
</template>

<script>
import vSelect from "vue-select";
export default {
    data() {
        return {
            actualizar_porcentaje: '',
            classvalidar_actualizar_porcentaje: '',
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        tr_data: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this;
        me.actualizar_porcentaje = me.tr_data.ven_desc_por
    },
    methods: {
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
        validarkey_actualizar_porcentaje(event) {
            const tecla = event.key;

            // Bloquear cualquier cosa que no sea un número del 0 al 9
            if (!/^\d$/.test(tecla)) {
                event.preventDefault();
                return;
            }

            // Obtener el valor actual del input y el valor que se agregaría
            const input = event.target;
            const valorActual = input.value;

            // Si hay texto seleccionado, reemplazará el texto actual
            const selectionStart = input.selectionStart;
            const selectionEnd = input.selectionEnd;

            const nuevoValor = valorActual.slice(0, selectionStart) + tecla + valorActual.slice(selectionEnd);

            // Verificar si el nuevo valor sería mayor a 100
            if (parseInt(nuevoValor) > 100) {
                event.preventDefault();
            }
        },
        validarcampo_actualizar_porcentaje() {
            let me = this;
            const focus_actualizar_porcentaje = me.$refs.actualizar_porcentaje.$el.querySelector('input');
            focus_actualizar_porcentaje.focus();
            me.classvalidar_actualizar_porcentaje = 'stylevalidarinput';
            //Notificación de vacio
            me.$vs.notify({
                text: 'Escriba el porcentaje que desea actualizar',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_actualizar_porcentaje = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        validarnopegar(event) {
            // Obtener el texto pegado
            let pastedText = (event.clipboardData || window.clipboardData).getData('text');

            // Verificar si el texto pegado contiene solo números
            if (!/^\d+$/.test(pastedText)) {
                event.preventDefault();
                return;
            }
            // Convertir el texto pegado a número
            let valor = parseInt(pastedText);

            // Verificar si el número está fuera del rango permitido
            if (isNaN(valor) || valor < 0 || valor > 100) {
                event.preventDefault();
            }
        },
        ActualizarPorcentaje() {
            let me = this;
            me.$vs.loading()
            if ((me.actualizar_porcentaje == 'undefined') || (me.actualizar_porcentaje == '') || (me.actualizar_porcentaje == null)) {
                me.validarcampo_actualizar_porcentaje();
                return
            }
            // console.log(me.tabRetencion, "tabretencion");
            const datosParaGuardar = {
                ven_desc_por: me.actualizar_porcentaje,
                id_empresa: me.tr_data.id_empresa,
                ven_codigo: me.tr_data.ven_codigo,
            };
            // console.log(datosParaGuardar, "datosssssssss");
            // return;
            me.$http.post(me.$server_url + 'Post_ActualizarPorcentaje_Venta', datosParaGuardar)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 7000,
                        })
                        me.$vs.loading.close()
                        me.nombre_archivo = res.data.egf_url;
                        // console.log(me.nombre_archivo, "name primer metodo");
                        this.$emit('change', {
                            verificaractualizacionporcentaje: 1
                        });
                    } else {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            title: 'Error',
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                            time: 7000,
                        })
                    }
                })
                .catch(error => {
                    console.error('Error al guardar los datos:', error);
                    // me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error interno, no se puede guardar la retencion.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 7000,
                    })
                    return
                });
        },
        getCancelar() {
            this.$emit('change', {
                verificaractualizacionporcentaje: 2
            });
        },
        changeHandleActualizarInfoMovVenta(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificarinfoactualizar); // Debería imprimir 1
            if (e.verificarinfoactualizar == 1) {
                console.log("Emit recibido por guardado.");
                me.popupGuardarEditarInformacionMovVenta = false;
                me.getMovVenta_Informacion();
            } else if (e.verificarinfoactualizar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupGuardarEditarInformacionMovVenta = false;
                me.getMovVenta_Informacion();
            } else {
                console.log("Emit no recibido");
            }
        },
    },
};
</script>

<style scoped>
.informacionformhijodehijo {
    z-index: 51002;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}

.stylevalidarinput {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}
</style>
