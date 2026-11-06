<template>
<div>
    <vx-card id="seccionImprimir2" align="center">

        <!-- Buscador -->
        <div class="buscador-container">
            <input v-model="busqueda_x_codigo_o_nombre" placeholder="🔍 Buscar por código o nombre..." class="buscador-input" />
        </div>
        <!-- ========================= CASO 1: API VACÍA ========================= -->
        <div v-if="Array_Lista_Productos_Inconsistentes.length === 0" class="mensaje-vacio">
            🟡 <b>No existen productos inconsistentes en este momento.</b>
        </div>
        <!-- LISTA -->
        <div v-else>
            <!-- ========================= CASO 2: BUSQUEDA SIN RESULTADOS ========================= -->
            <div v-if="listaFiltrada.length === 0" class="mensaje-sin-resultados">
                <b>No se encontraron resultados para "{{ busqueda_x_codigo_o_nombre }}"</b>
            </div>
            <!-- ========================= LISTA DE TARJETAS ========================= -->
            <div v-else class="tarjetas-lista">
                <div v-for="item in listaFiltrada" :key="item.pro_codigo" class="tarjeta">
                    <!-- CABECERA -->
                    <div class="tarjeta-header">
                        <div>
                            <div style="font-size:16px; font-weight:700;">
                                {{ item.pro_codigo }}
                                <div v-if="query_sumas_detallado[item.pro_codigo]" style="font-size:13px; font-weight:400; color:#555; margin-top:3px;">
                                    ({{ query_sumas_detallado[item.pro_codigo].pro_nombre }})
                                </div>
                                <div v-if="query_sumas_detallado[item.pro_codigo]" style="margin-top:4px; font-size:12px; color:#0a4b91; font-weight:600;">
                                    Total descuadre en stock general:
                                    <span style="background:#e8f1ff; padding:2px 8px; border-radius:6px; border:1px solid #c8ddff;">
                                        {{ query_sumas_detallado[item.pro_codigo].total }}
                                    </span>
                                </div>
                            </div>
                            <div class="nombre-asignatura">
                                {{ item.nombreasignatura }}
                            </div>
                        </div>
                        <button @click="toggleDetalles(item)" class="btn-ver">
                            {{ item.showDetails ? 'Ocultar listado ⯆' : 'Ver listado ⯈' }}
                        </button>
                    </div>
                    <!-- CÓDIGOS ASOCIADOS -->
                    <div v-if="item.pro_codigos_desglose && item.pro_codigos_desglose.length" class="codigos-asociados">
                        <b>📦 Códigos asociados:</b>
                        <div class="codigos-lista">
                            <div v-for="(libro,i) in item.pro_codigos_desglose" :key="'libro-'+i" class="codigo-item">
                                • <b>{{ libro.codigo_liquidacion }}</b> – {{ libro.nombrelibro }}
                            </div>
                        </div>
                    </div>
                    <!-- PANEL EXPANDIDO -->
                    <transition name="fade">
                        <div v-if="item.showDetails" class="panel-detalles">
                            <h4 class="titulo-panel">
                                📑 Proformas donde aparece <b>{{ item.pro_codigo }}</b>
                            </h4>
                            <div v-for="pro in getProformasDelProducto(item.pro_codigo)" :key="'pro-'+pro.prof_id" class="item-proforma">
                                <div><b>Proforma:</b> {{ pro.prof_id }}</div>
                                <div><b>Periodo:</b> {{ pro.descripcion_periodo }}</div>
                                <div>
                                    <b>Estado:</b>
                                    <span :style="{ color:getColorEstado(pro.prof_estado), fontWeight:'700' }">
                                        {{ getNombreEstado(pro.prof_estado) }}
                                    </span>
                                </div>
                                <div v-for="det in getDetalles(pro, item.pro_codigo)" :key="'det-'+det.pro_codigo+det.det_prof_cantidad" class="detalle-item">
                                    <!-- <div><b>Cantidad:</b> {{ det.det_prof_cantidad }}</div> -->
                                    <div><b>Pendiente:</b> {{ det.pendiente }}</div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </vx-card>
</div>
</template>

<script>
export default {
    data() {
        return {
            Array_Lista_Productos_Inconsistentes: [],
            query_proforma_y_detalles: [],
            query_sumas_detallado: {}, // 🔥 agregado aquí
            busqueda_x_codigo_o_nombre: "",
        };
    },

    mounted() {
        this.metodoEjecucion_Apis();
    },

    computed: {
        listaFiltrada() {
            var texto = (this.busqueda_x_codigo_o_nombre || "").toLowerCase();
            if (!texto) return this.Array_Lista_Productos_Inconsistentes;
            return this.Array_Lista_Productos_Inconsistentes.filter(item => {
                // -----------------------------------------------
                // Buscar por pro_codigo
                // -----------------------------------------------
                if (
                    item.pro_codigo &&
                    item.pro_codigo.toLowerCase().includes(texto)
                ) {
                    return true;
                }
                // -----------------------------------------------
                // Buscar por pro_nombre desde query_sumas_detallado
                // -----------------------------------------------
                if (this.query_sumas_detallado[item.pro_codigo]) {
                    var nombre = this.query_sumas_detallado[item.pro_codigo].pro_nombre || "";
                    nombre = nombre.toLowerCase();

                    if (nombre.includes(texto)) {
                        return true;
                    }
                }
                // No coincide
                return false;
            });
        }
    },

    methods: {

        Consultar_Lista_Productos_Inconsistentes() {
            let me = this;
            return new Promise(function (resolve, reject) {
                me.$http
                    .get(me.$server_url + "Getstockproductosrestablecer_SINACTUALIZAR")
                    .then(function (res) {
                        me.Array_Lista_Productos_Inconsistentes = res.data.producto_actual || [];
                        me.query_proforma_y_detalles = res.data.query_proforma_y_detalles || [];
                        me.query_sumas_detallado = res.data.query_sumas_detallado || {}; // 🔥 Aquí llega el nombre
                        resolve();
                    })
                    .catch(reject);
            });
        },

        metodoEjecucion_Apis() {
            let me = this;
            me.$vs.loading();
            this.Consultar_Lista_Productos_Inconsistentes()
                .finally(() => me.$vs.loading.close());
        },

        toggleDetalles(item) {
            if (typeof item.showDetails === "undefined") {
                this.$set(item, "showDetails", true);
            } else {
                item.showDetails = !item.showDetails;
            }
        },

        getProformasDelProducto(codigo) {
            var lista = [];
            for (var i = 0; i < this.query_proforma_y_detalles.length; i++) {
                var p = this.query_proforma_y_detalles[i];
                for (var j = 0; j < p.detalles_proforma.length; j++) {
                    if (p.detalles_proforma[j].pro_codigo === codigo) {
                        lista.push(p);
                        break;
                    }
                }
            }
            return lista;
        },

        getDetalles(proforma, codigo) {
            var arr = [];
            for (var i = 0; i < proforma.detalles_proforma.length; i++) {
                var det = proforma.detalles_proforma[i];
                if (det.pro_codigo === codigo) arr.push(det);
            }
            return arr;
        },

        getNombreEstado(estado) {
            return {
                1: "Pendiente",
                3: "Aprobado",
                6: "Aprobado con pendiente",
            } [estado] || "Desconocido";
        },

        getColorEstado(estado) {
            return {
                1: "#d49100",
                3: "#0a8a00",
                6: "#0057b8",
            } [estado] || "#444";
        }
    },
};
</script>

<style scoped>
/* Animación */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .25s ease-in-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

/* BUSCADOR */
.buscador-container {
    margin-bottom: 15px;
    text-align: right;
}

.buscador-input {
    padding: 8px 14px;
    font-size: 14px;
    width: 260px;
    border: 1px solid #ddd;
    border-radius: 6px;
}

/* MENSAJES */
.mensaje-vacio {
    padding: 20px;
    background: #fff8e1;
    border: 1px solid #ffe7a5;
    border-radius: 8px;
    color: #b77400;
    font-weight: 600;
    text-align: center;
}

.mensaje-sin-resultados {
    padding: 20px;
    background: #ffecec;
    border: 1px solid #ffb2b2;
    border-radius: 8px;
    color: #c0392b;
    font-weight: 600;
    text-align: center;
}

/* TARJETAS */
.tarjetas-lista {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.tarjeta {
    background: white;
    border-radius: 10px;
    border: 1px solid #d8d8d8;
    padding: 18px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    text-align: left;
}

/* HEADER TARJETA */
.tarjeta-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.codigo-con-nombre {
    font-size: 16px;
    font-weight: 700;
}

.codigo-nombre-extra {
    color: #777;
    font-weight: 400;
}

.nombre-asignatura {
    font-size: 14px;
    color: #666;
}

/* BOTÓN */
.btn-ver {
    padding: 6px 14px;
    border-radius: 6px;
    background: #eef4ff;
    border: 1px solid #c5d8ff;
    cursor: pointer;
    font-size: 13px;
}

/* CÓDIGOS ASOCIADOS */
.codigos-asociados {
    margin-top: 10px;
    font-size: 13px;
}

.codigos-lista {
    margin-top: 4px;
    padding-left: 10px;
}

.codigo-item {
    color: #444;
}

/* PANEL EXPANDIDO */
.panel-detalles {
    margin-top: 15px;
    padding: 15px;
    background: #f8faff;
    border-radius: 8px;
    border: 1px solid #d4e2ff;
}

.titulo-panel {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #333;
}

.item-proforma {
    padding: 12px;
    margin-bottom: 12px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e0e6f7;
}

.detalle-item {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px dashed #ccc;
}
</style>
