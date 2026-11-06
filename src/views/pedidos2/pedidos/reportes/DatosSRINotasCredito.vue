<template>
<div class="p-4">
    <!-- Mostrar ven_codigo -->
    <div class="mb-4 flex justify-center items-center">
        <b>Código de Venta</b>
        {{ localItemSeleccionado.ven_codigo  }}
    </div>

    <!-- Campo para editar fecha_sri (flatPickr) -->
    <div class="mb-4 flex justify-center items-center">
        <b class="mr-2">Fecha SRI</b>
        <flat-pickr :config="configdateTimePicker" v-model="localItemSeleccionado.fecha_sri" placeholder="Fecha " style="display: inline-block;width: 70%" />
    </div>

    <!-- Campo para editar documento_sri (vs-input) -->
    <div class="mb-4 flex justify-center items-center ">
        <b class="mr-2">Documento SRI</b>
        <vs-input v-model="localItemSeleccionado.documento_sri" class="mt-1" style="width: 50%" />
    </div>

    <!-- Botón de actualización -->
    <div class="flex justify-center items-center">
        <vs-button @click="actualizarNotasCredito" class="justify-center">
            Actualizar
        </vs-button>
    </div>
</div>
</template>

<script>

import Vue from "vue";
import axios from "axios";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from "vue-select";


export default {
    components: {
        "v-select": vSelect,
        flatPickr,
    },
    data() {
        return {
            // Crear una copia local de ItemSeleccionado
            localItemSeleccionado: {
                ven_codigo:'',
                empresa:'',
                fecha_sri: '',
                documento_sri: '',
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            usuario:[],
        };
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    props: {
        ItemSeleccionado: {
            type: Object,
            default: () => {}
        },
    },
    mounted() {
        if (!this.ItemSeleccionado) {
            this.$vs.notify({
                title: 'Error',
                text: 'Error al obtener el documento.',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
            });
            this.$emit('documento-no-seleccionado');
            return;
        } else {
            // Aquí ya estamos trabajando con la copia local, así que no es necesario modificar el prop
            this.localItemSeleccionado.ven_codigo = this.ItemSeleccionado.ven_codigo;
            this.localItemSeleccionado.fecha_sri = this.ItemSeleccionado.fecha_sri;
            this.localItemSeleccionado.empresa = this.ItemSeleccionado.id_empresa;
            this.localItemSeleccionado.documento_sri = this.ItemSeleccionado.documento_sri;
        }
    },
    methods: {
        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },
        actualizarNotasCredito() {
            let me = this;

            me.$vs.loading();

            let datos = {
                fecha_sri: this.localItemSeleccionado.fecha_sri,
                documento_sri: this.localItemSeleccionado.documento_sri,
                ven_codigo: this.localItemSeleccionado.ven_codigo,
                empresa: this.localItemSeleccionado.empresa,
                usuario: this.usuario.idusuario,
            }

            // Enviar los datos de la copia local al servidor
            this.$http.post(this.$server_url + `actualizardatosNotasCredito`, datos)
                .then((res) => {
                    let datos = res.data;
                    this.$emit('actualizado-datos');
                    this.$vs.notify({
                        title: 'Éxito',
                        text: 'Datos actualizados correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(datos);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al actualizar los datos.',
                        type: 'error',
                    });
                    this.$emit('documento-no-seleccionado');
                    me.$vs.loading.close();
                });
        },
    }
};
</script>
