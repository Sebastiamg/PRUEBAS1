<template>
<vs-row class="transferencia-container">
    <!-- Título -->
    <vs-col vs-w="12" class="text-center mb-6">
        <h3 class="transferencia-titulo">Transferencia de Videos</h3>
        <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-4 rounded shadow-md inline-block text-left max-w-3xl mx-auto">
            <p class="text-base">
                <strong>Importante:</strong> Solo se transferirán los videos que tengan <strong>el mismo nombre de tema</strong> y <strong>el mismo número de unidad</strong>. Si alguno de estos no coincide, se desplegará una lista de los NO transferidos.
            </p>
        </div>
    </vs-col>
    <!-- Contenedor para Origen, Flecha, Destino -->
    <vs-col vs-w="12" class="mb-5">
        <div class="transferencia-table">
            <!-- Origen -->
            <div class="origen">
                <label class="label-estilo">Origen</label>
                <!-- {{Origen_asignaturaSelect.idasignatura}} -->
                <v-select v-model="Origen_asignaturaSelect" :options="Asignaturas" :reduce="_origen => _origen" label="nombreasignatura" placeholder="Seleccione la asignatura de origen" ref="Origen_asignaturaSelect" :class="classvalidar_Origen_asignaturaSelect" @input="ValidacionSelect()" />
            </div>
            <!-- Flecha -->
            <div class="flecha">
                <i class="fas fa-arrow-right"></i>
            </div>
            <!-- Destino -->
            <div class="destino">
                <label class="label-estilo">Destino</label>
                <!-- {{Destino_asignaturaSelect.idasignatura}} -->
                <v-select v-model="Destino_asignaturaSelect" :options="Asignaturas_filtradas_Destino" :reduce="asig_destino => asig_destino" label="nombreasignatura" placeholder="Seleccione la asignatura de destino" ref="Destino_asignaturaSelect" :disabled="!Origen_asignaturaSelect" :class="classvalidar_Destino_asignaturaSelect" @input="ValidacionSelect()" />
            </div>

            <!-- Botón -->
            <vs-col vs-w="12" class="text-center">
                <vs-button color="primary" type="filled" :disabled="!Origen_asignaturaSelect || !Destino_asignaturaSelect" @click="CompletarTransferencia()">
                    Transferir Videos
                </vs-button>
            </vs-col>
            <div style="height: 250px" v-if="videosNoTransferidos.length == 0"></div>
        </div>
    </vs-col>
    <vs-col vs-w="12" v-if="videosNoTransferidos.length > 0" class="mt-5">
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md max-w-4xl mx-auto">
            <p class="text-base font-semibold mb-3">⚠️ Videos que no se pudieron transferir: <b>{{ videosNoTransferidos.length }}</b></p>
            <table class="w-full text-sm text-left border border-gray-300 rounded overflow-hidden">
                <thead class="bg-red-100 text-red-800">
                    <tr>
                        <th class="p-2 border-b">Nombre del Video</th>
                        <th class="p-2 border-b">Unidad</th>
                        <th class="p-2 border-b">Tema</th>
                        <th class="p-2 border-b">Motivo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(video, index) in videosNoTransferidos" :key="index" class="bg-white hover:bg-red-50 transition-all">
                        <td class="p-2 border-b">{{ video.nombre_video }}</td>
                        <td class="p-2 border-b text-center">{{ video.unidad }}</td>
                        <td class="p-2 border-b">{{ video.tema }}</td>
                        <td class="p-2 border-b text-red-700 font-medium">{{ video.motivo_no_transferencia }}</td>
                    </tr>
                </tbody>
            </table>
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
            classvalidar_Origen_asignaturaSelect: '',
            classvalidar_Destino_asignaturaSelect: '',
            libroOrigen: null,
            Origen_asignaturaSelect: '',
            Destino_asignaturaSelect: '',
            Asignaturas_filtradas_Destino: [],
            videosNoTransferidos: []
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
        Asignaturas: {
            type: Array,
            default: function () {
                return []
            }
        },
        bookSelect: {
            type: Number,
            default: 0
        }
    },
    mounted() {},
    methods: {
        ValidacionSelect() {
            if (!this.Origen_asignaturaSelect) {
                this.Destino_asignaturaSelect = '';
                this.validarcampo_buscar_Origen_asignaturaSelect();
                return;
            }
            if (!this.Destino_asignaturaSelect) {
                this.Destino_asignaturaSelect = '';
                this.Asignaturas_filtradas_Destino = this.Asignaturas.filter(asig => asig.idasignatura != this.Origen_asignaturaSelect.idasignatura);
                this.validarcampo_buscar_Destino_asignaturaSelect();
                return;
            }
        },

        validarcampo_buscar_Origen_asignaturaSelect() {
            let me = this;
            me.classvalidar_Origen_asignaturaSelect = 'stylevalidar';
            me.$nextTick(() => {
                const input = me.$refs.Origen_asignaturaSelect &&
                    me.$refs.Origen_asignaturaSelect.$el &&
                    me.$refs.Origen_asignaturaSelect.$el.querySelector('input');
                if (input) input.focus();
            });
            me.$vs.notify({
                text: "Seleccione la asignatura de origen.",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000,
            });
            setTimeout(() => {
                me.classvalidar_Origen_asignaturaSelect = '';
            }, 1500);
        },
        validarcampo_buscar_Destino_asignaturaSelect() {
            let me = this;
            me.classvalidar_Destino_asignaturaSelect = 'stylevalidar';
            me.$nextTick(() => {
                const input = me.$refs.Destino_asignaturaSelect &&
                    me.$refs.Destino_asignaturaSelect.$el &&
                    me.$refs.Destino_asignaturaSelect.$el.querySelector('input');
                if (input) input.focus();
            });
            me.$vs.notify({
                text: "Seleccione la asignatura de destino.",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000,
            });
            setTimeout(() => {
                me.classvalidar_Destino_asignaturaSelect = '';
            }, 1500);
        },
        CompletarTransferencia() {
            let me = this;
            if ((me.Origen_asignaturaSelect == 'undefined') || (me.Origen_asignaturaSelect == '') || (me.Origen_asignaturaSelect == null)) {
                me.validarcampo_buscar_Origen_asignaturaSelect();
                return;
            }
            if ((me.Destino_asignaturaSelect == 'undefined') || (me.Destino_asignaturaSelect == '') || (me.Destino_asignaturaSelect == null)) {
                me.validarcampo_buscar_Destino_asignaturaSelect();
                return;
            }
            let usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
            let user_created = usuarioLocal.idusuario;
            let datos = {
                "asignatura_a_transferir": me.Origen_asignaturaSelect,
                "asignatura_recibir_transferencia": me.Destino_asignaturaSelect,
                "user_created": user_created
            }
            console.log(datos, "data a enviar")
            console.log(datos);
            // return;
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'Transferencia_Videos_Asignatura', datos)
                .then(res => {
                    me.videosNoTransferidos = res.data.videos_no_transferidos;
                    me.$vs.loading.close()
                    if (res.data.status == 1) {
                        me.videosNoTransferidos = res.data.videos_no_transferidos;

                        if (me.videosNoTransferidos.length > 0) {
                            // Hay errores → mostramos tabla, no cerramos
                            me.$vs.notify({
                                text: 'Algunos videos no se pudieron transferir. Revise el detalle.',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            });
                        } else {
                            if (res.data.videos_transferidos == 0) {
                                me.$vs.notify({
                                    text: 'No se transfirieron videos.',
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                            } else {
                                me.$vs.notify({
                                    text: 'Todos los videos se transfirieron con éxito.',
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                            }

                            this.$emit('change', {
                                verificacionemittransferencia: 1
                            });
                        }
                    }
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Los videos no se pudieron transferir',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
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

.transferencia-container {
    /* max-width: 600px; */
    margin: 0 auto;
    padding: 1.5rem 1rem;
    background-color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.transferencia-titulo {
    font-weight: 700;
    font-size: 1.8rem;
    color: #1e293b;
    /* azul grisáceo */
    margin-bottom: 1.5rem;
}

.label-estilo {
    font-weight: 600;
    font-size: 0.9rem;
    color: #475569;
    /* gris oscuro */
    margin-bottom: 0.4rem;
    display: block;
}

.vs-button--filled {
    border-radius: 10px;
    padding: 0.6rem 2rem;
    font-weight: 600;
    font-size: 1.1rem;
    transition: background-color 0.3s ease;
}

.vs-button--filled:hover:not(:disabled) {
    background-color: #1e40af;
    /* azul oscuro */
}

.vs-button--disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
}

/* Responsive: en pantallas pequeñas, el padding es más compacto */
@media (max-width: 480px) {
    .transferencia-container {
        padding: 1rem 0.5rem;
    }

    .transferencia-titulo {
        font-size: 1.5rem;
    }

    .vs-button--filled {
        width: 100%;
        padding: 0.7rem 0;
        font-size: 1rem;
    }
}

.transferencia-table {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    max-width: 800px;
    margin: 0 auto;
}

.origen,
.destino {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
}

.flecha {
    text-align: center;
    font-size: 2rem;
    color: #4CAF50;
}

@media (max-width: 768px) {
    .transferencia-table {
        flex-direction: column;
        gap: 20px;
    }

    .origen,
    .destino {
        min-width: 100%;
        max-width: 100%;
    }

    .flecha {
        margin: 10px 0;
    }
}
</style>
