<template>
<vs-row align="center" class="contenedor-transferencia">
    <!-- 🔹 Mensaje informativo superior -->
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" v-if="libroSelecttranferir">
        <div class="mensaje-info animate__animated animate__fadeInDown">
            <i class="feather icon-info mr-2"></i>
            <span>
                Solo se podrán transferir las unidades si el <b>libro destino: {{ libroSelecttranferir.nombrelibro }}</b> no tiene registros de unidades.
            </span>
        </div>
    </vs-col>
    <!-- 🔸 Selector de libro -->
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-4">
        <div class="panel-seleccion">
            <label class="etiqueta-seleccion">
                Seleccione el libro al que desea transferir las unidades:
            </label>
            <v-select :options="librosFiltrados" class="selector-libro w-full" placeholder="--Seleccione un libro--" v-model="libroSelecttranferir" label="nombrelibro" :reduce="librosFiltrados => librosFiltrados" ref="libroSelecttranferir" :class="classvalidar_libroSelecttranferir" />
        </div>
    </vs-col>
    <!-- 🔸 Botón de acción -->
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-6">
        <vs-button @click="libroSeleccionado()" type="relief" class="btn-transferir">
            <i class="feather icon-refresh-cw mr-2"></i>
            Transferir Unidades
        </vs-button>
    </vs-col>
    <!-- 🔻 Mensaje de error -->
    <vs-col v-if="mensajeErrorTransferencia" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-4">
        <div class="mensaje-error animate__animated animate__fadeInDown">
            <i class="feather icon-alert-triangle mr-2"></i>
            {{ mensajeErrorTransferencia }}
        </div>
    </vs-col>
</vs-row>
</template>

<script>
import vSelect from "vue-select";
export default {
    data() {
        return {
            librosFiltrados: [],
            libroSelecttranferir: '',
            classvalidar_libroSelecttranferir: '',
            mensajeErrorTransferencia: '',
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        libroSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
        libros: {
            type: Array,
            default: function () {
                return []
            }
        },
    },
    mounted() {
        let me = this;
        me.librosFiltrados = this.libros.filter(libro => libro.idlibro !== this.libroSelect.idlibro);
    },
    methods: {
        validarcampo_buscar_libroSelecttranferir() {
            let me = this;
            const focus_libroSelecttranferir = me.$refs.libroSelecttranferir.$el.querySelector('input');
            focus_libroSelecttranferir.focus();
            me.classvalidar_libroSelecttranferir = 'stylevalidar';
            //Notificación de vacio
            me.$vs.notify({
                text: "Seleccione el libro que va a recibir la transferencia de unidades.",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000,
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_libroSelecttranferir = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        libroSeleccionado() {
            let me = this;
            if (!me.libroSelecttranferir || !me.libroSelecttranferir.idlibro) {
                me.validarcampo_buscar_libroSelecttranferir();
                return;
            }
            me.mensajeErrorTransferencia = ''; // Limpiar mensaje previo
            let datos = {
                libro_a_transferir: me.libroSelect.idlibro,
                libro_recibir_transferencia: me.libroSelecttranferir.idlibro,
            };
            me.$vs.loading();
            this.$http.post(this.$server_url + 'transferenciaUnidades', datos)
                .then(res => {
                    me.$vs.loading.close();

                    if (res.data.status === 1) {
                        // Éxito
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        this.$emit('change', {
                            verificacionemittransferencia: 1
                        });
                        me.mensajeErrorTransferencia = ''; // limpiar si antes hubo error
                    } else {
                        // Error controlado (status 0)
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                        });
                        me.mensajeErrorTransferencia = res.data.message;
                    }
                })
                .catch(error => {
                    me.$vs.loading.close();
                    me.mensajeErrorTransferencia = (error.response && error.response.data && error.response.data.message) ?
                        error.response.data.message :
                        'Ocurrió un error inesperado al intentar transferir las unidades.';
                });
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
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

.stylevalidar {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

/* 🌟 CONTENEDOR GENERAL */
.contenedor-transferencia {
  background: #fdfdfd;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 700px;
  margin: 0 auto;
}

/* 🔹 MENSAJE INFORMATIVO */
.mensaje-info {
  background: linear-gradient(135deg, #e6f4ff, #f0f8ff);
  color: #0a74da;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 500;
  text-align: center;
  border-left: 5px solid #1a73e8;
  box-shadow: 0 2px 6px rgba(26, 115, 232, 0.15);
  line-height: 1.6;
}

/* 🔻 MENSAJE DE ERROR */
.mensaje-error {
  background: linear-gradient(135deg, #fdecea, #fff5f5);
  color: #d93025;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 500;
  text-align: center;
  border-left: 5px solid #d93025;
  box-shadow: 0 2px 6px rgba(217, 48, 37, 0.15);
  line-height: 1.6;
}

/* 🧩 PANEL DE SELECCIÓN */
.panel-seleccion {
  width: 100%;
  max-width: 500px;
  text-align: left;
}

.etiqueta-seleccion {
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
  display: block;
}

.selector-libro {
  border-radius: 10px !important;
  font-size: 15px;
}

/* 🔘 BOTÓN DE TRANSFERENCIA */
.btn-transferir {
  background: linear-gradient(135deg, #1a73e8, #0b59d1);
  color: white !important;
  padding: 10px 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.btn-transferir:hover {
  background: linear-gradient(135deg, #0b59d1, #0047b3);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(26, 115, 232, 0.25);
}

/* 🧭 ANIMACIONES SUAVES */
.animate__animated {
  --animate-duration: 0.6s;
}
</style>
