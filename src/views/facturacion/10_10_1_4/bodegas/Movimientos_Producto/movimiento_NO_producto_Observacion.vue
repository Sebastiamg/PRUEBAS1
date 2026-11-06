<template>
<vx-card fixed-height="true">
    <!-- SECCION REGISTRO -->
    <vs-row>
        <vs-col vs-lg="12">
            <font style="font-size: 11.5px">&nbsp;Observación</font><br>
            <vs-textarea v-model="observacion_new" rows="3" placeholder="Ingrese la observación" class="w-full" />
        </vs-col>
    </vs-row>
    <vs-row>
        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <div align="center">
                <vs-button class="m-1" @click="guardarObservacion()">Guardar</vs-button>
                <vs-button class="m-1" @click="getCancelar()" color="danger">Cancelar</vs-button>
            </div>
        </vs-col>
    </vs-row>
</vx-card>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
export default {
    data() {
        return {
            observacion_new: '',
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        usuario: {
            type: Object,
            default: function () {
                return {}
            }
        },
        idmovimiento: {
            type: Object,
            default: function () {
                return {}
            }
        },
        CompletoIngreso: {
            type: String,
            default: '',
        },
        SecuencialIngreso: {
            type: String,
            default: '', // Asigna el valor por defecto aquí
        },
    },
    mounted() {
        const frase = 'Documento generado a partir de la edición de stock masiva de combos.';
        if (this.idmovimiento.fmp_estado === 4) {
            // Si el estado es 4, verificamos si contiene la frase
            if (this.idmovimiento.observacion && this.idmovimiento.observacion.includes(frase)) {
                this.observacion_new = this.idmovimiento.observacion.replace(frase, '').trim();
            } else {
                this.observacion_new = this.idmovimiento.observacion || '';
            }
        } else {
            // Si el estado no es 4, usamos todo el texto de la observación
            this.observacion_new = this.idmovimiento.observacion || '';
        }
    },
    methods: {
        guardarObservacion() {
            let me = this;
            let datos = {
                "fmp_id": me.CompletoIngreso,
                "observacion": me.observacion_new,
                "fmp_estado": me.idmovimiento.fmp_estado,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'ModificarObservacion_MovientoProducto', datos)
                .then(res => {
                    me.$vs.loading.close()
                    // this.getMaterialcubiertaParametro();
                    me.$vs.notify({
                        text: 'Observación editada con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$emit('change', {
                        verificacionemiteditObservacion: 1
                    });
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Observación no se pudo editar.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemiteditObservacion: 2
            });
        },
    },
};
</script>
