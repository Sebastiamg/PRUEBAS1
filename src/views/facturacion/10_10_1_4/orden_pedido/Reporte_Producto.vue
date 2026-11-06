<template>
<div>
    <div>
        <vs-row justify="center">
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-card class="seccionmostrartodo">
                    <!-- Encabezado -->
                    <div class="items-center bg-primary text-white py-2 rounded-t-lg" align="center">
                        <span class="text-sm font-semibold">Búsqueda</span>
                    </div>
                    <!-- Selección de productos -->
                    <div v-if="tipoReporte == 0" class="estilo-borde">
                        <label class="texto-claro font-medium">Seleccione el/los grupo/s de producto/s:</label>
                        <v-select :options="GrupoProducto" :reduce="p => p.gru_pro_codigo" label="gru_pro_nombre" v-model="grupo_codigo_selected" placeholder="--Buscar y seleccionar uno o varios--" multiple :closeOnSelect="false" class="w-full mt-2" style="font-size: 14px;" ref="parametrogrupo_producto" :class="classvalidar_parametrogrupo_producto" />
                        <!-- Nota -->
                        <vs-alert color="warning" icon="info" class="my-2" active="true">
                            El grupo de productos "Textos" contiene algunos productos que son combos.
                        </vs-alert>
                        <div align="center" class="m-3">
                            <vs-button @click="BuscarProductos_paraReporte();" color="success" type="relief">Buscar</vs-button>&emsp;
                        </div>
                    </div>
                    <!-- Mensaje si tipoReporte == 1 -->
                    <div v-if="tipoReporte == 1" class="estilo-borde">
                        <span class="texto-claro">(Todos los productos están incluidos en esta búsqueda).</span>
                        <vs-alert color="warning" icon="info" class="my-2" active="true">
                            El grupo de productos "Textos" contiene algunos productos que son combos.
                        </vs-alert>
                    </div>
                    <!-- Radios -->
                    <div class="flex-wrap">
                        <vs-radio v-model="tipoReporte" vs-name="radios1tipoReporte" :vs-value="0" @input="busqueda = 'param_stock'; limpiar()" class="m-2">
                            Grupos de Producto
                        </vs-radio>
                        <vs-radio v-model="tipoReporte" vs-name="radios1tipoReporte" :vs-value="1" @input="busqueda = 'param_valor'; limpiar()" class="m-2">
                            Completo
                        </vs-radio>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>
    </div>
    <div v-if="ProductoReporte.length == 0" style="min-height: 400px;"></div>
    <div class="botones-reporte" v-if="ProductoReporte.length > 0">
        <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" @click="m_imprimirTodos('12px', nombrearchivo_descarga, '0px')">Descargar Reporte Pdf</vs-button>
        <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" @click="ExportToExcel()">Descargar Reporte Excel</vs-button>
    </div>
    <vx-card id="seccionImprimir2" v-if="ProductoReporte.length > 0" align="center">
        <table v-if="gruposParaMostrar.length" id="tablaResumen">
            <tr align="center">
                <td colspan="9">
                    <h5 class="text-center font-bold" style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 20px;">
                        REPORTE DE PRODUCTOS</h5>
                </td>
            </tr>
            <tr align="center">
                <td width="200"><b>Total Productos: </b> </td>
                <td width="150">{{ ProductoReporte.length }} Unidades</td>
            </tr>
            <tr align="center" v-for="grupo in gruposParaMostrar" :key="grupo.gru_pro_codigo">
                <td><b>{{ grupo.gru_pro_nombre }}:</b></td>
                <td>{{ contarProductosPorGrupo(grupo.gru_pro_codigo) }} Unidades</td>
            </tr>
        </table>
        <table border="1" width="100%" id="tablaProductos">
            <thead>
                <tr>
                    <td align="center" style="border: 1px solid #000000 !important; font-weight: bold;" width="70">Código</td>
                    <td align="center" style="border: 1px solid #000000 !important; font-weight: bold;" width="400">Nombre</td>
                    <td align="center" style="border: 1px solid #000000 !important; font-weight: bold;" width="60">Grupo</td>
                    <td align="center" style="border: 1px solid #000000 !important; font-weight: bold;" width="90">Stock General</td>
                    <td align="center" style="border: 1px solid #000000 !important; font-weight: bold;" width="90">Stock Facturas Calmed</td>
                    <td align="center" style="border: 1px solid #000000 !important; font-weight: bold;" width="60">Combo</td>
                    <td align="center" style="border: 1px solid #000000 !important; font-weight: bold;" width="60">Códigos Combo</td>
                    <td align="center" style="border: 1px solid #000000 !important; font-weight: bold;" width="60">Códigos Plus</td>
                    <td align="center" style="border: 1px solid #000000 !important; font-weight: bold;" width="60">Serie</td>
                </tr>
            </thead>
            <tr v-for="producto in ProductoReporte" :key="producto.pro_codigo" style="border: 1px solid #000000 !important">
                <td>{{ producto.pro_codigo }}</td>
                <td>{{ producto.pro_nombre }}</td>
                <td>{{ producto.gru_pro_nombre }}</td>
                <td>{{ producto.pro_reservar }}</td>
                <td>{{ producto.pro_stockCalmed }}</td>
                <td>{{ producto.ifcombo_label }}</td>
                <td>{{ producto.codigos_combos }}</td>
                <td>{{ producto.codigos_plus }}</td>
                <td>{{ producto.nombre_serie }}</td>
            </tr>
        </table>
    </vx-card>
</div>
</template>

<script>
import {
    Spanish
} from "flatpickr/dist/l10n/es.js"; // Asegúrate de importar el locale
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from "vue-select";
import imprimirMixin from "@/mixins/Pedidosmix.js";
import * as XLSX from 'xlsx';
export default {
    mixins: [imprimirMixin],
    components: {
        "v-select": vSelect,
        flatPickr,
    },
    data() {
        return {
            ProductoReporte: [],
            GrupoProducto: [],
            parametrogrupo_producto: '',
            tipoReporte: 0,
            classvalidar_parametrogrupo_producto: '',
            grupo_codigo_selected: [],
            gruposParaMostrar: [],
            nombrearchivo_descarga: 'Reporte_Productos',
        };
    },
    mounted() {
        let me = this;
        me.getGrupoProductos();
    },
    methods: {
        limpiar() {
            this.parametrogrupo_producto = '';
            this.Producto = [];
            this.ProductoReporte = [];
            this.grupo_codigo_selected = [];
            if (this.tipoReporte == 1) {
                this.BuscarProductos_paraReporte();
            }
        },
        validarcampo_parametrogrupo_producto() {
            let me = this;
            const focus_parametrogrupo_producto = me.$refs.parametrogrupo_producto.$el.querySelector('input');
            focus_parametrogrupo_producto.focus();
            me.classvalidar_parametrogrupo_producto = 'stylevalidarinput';
            //Notificación de vacio
            me.$vs.notify({
                text: 'Seleccione al menos una opción de grupo de productos para realizar una búsqueda.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000,
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_parametrogrupo_producto = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        getGrupoProductos() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetGrupoProducto_SoloActivos')
                .then(res => {
                    this.GrupoProducto = res.data;
                    me.$vs.loading.close()
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        BuscarProductos_paraReporte() {
            let me = this;
            // console.log(me.tipoReporte, "ffff");
            // return
            if (me.grupo_codigo_selected.length == 0 && me.tipoReporte == 0) {
                me.validarcampo_parametrogrupo_producto();
                return;
            }
            // console.log(me.grupo_codigo_selected);
            let data_a_enviar = {
                grupo_codigo_selected: me.grupo_codigo_selected,
                tipoReporte: me.tipoReporte
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetProducto_Reportes', {
                    params: data_a_enviar
                })
                .then(res => {
                    // Asigna los productos y mapea ifcombo a texto
                    this.ProductoReporte = res.data.map(producto => {
                        let ifcombo_label = 'Sin Definir';
                        if (producto.ifcombo == 1) {
                            ifcombo_label = 'Sí';
                        } else if (producto.ifcombo == 0) {
                            ifcombo_label = 'No';
                        }
                        return {
                            ...producto,
                            ifcombo_label: ifcombo_label
                        };
                    });
                    // Almacenas los grupos que quieres mostrar en la tabla
                    const codigosUnicos = new Set();
                    const gruposUnicos = [];
                    this.ProductoReporte.forEach(producto => {
                        if (!codigosUnicos.has(producto.gru_pro_codigo)) {
                            codigosUnicos.add(producto.gru_pro_codigo);
                            gruposUnicos.push({
                                gru_pro_codigo: producto.gru_pro_codigo,
                                gru_pro_nombre: producto.gru_pro_nombre
                            });
                        }
                    });
                    this.gruposParaMostrar = gruposUnicos;
                    me.$vs.loading.close()
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        contarProductosPorGrupo(codigo) {
            return this.ProductoReporte.filter(p => p.gru_pro_codigo === codigo).length;
        },
        ExportToExcel() {
            let me = this;

            // 1. Obtener la tabla de resumen del DOM
            let tablaResumen = document.getElementById("tablaResumen");
            let wsResumen = XLSX.utils.table_to_sheet(tablaResumen);

            // 2. Convertir a array de arrays
            let dataResumen = XLSX.utils.sheet_to_json(wsResumen, {
                header: 1
            });

            // 3. Generar productosFiltrados manualmente
            let productosFiltrados = me.ProductoReporte.map(p => ({
                "Código": p.pro_codigo,
                "Nombre": p.pro_nombre,
                "Grupo": p.gru_pro_nombre,
                "Stock General": p.pro_reservar,
                "Stock Facturas Calmed": p.pro_stockCalmed,
                "Combo": p.ifcombo_label,
                "Códigos Combo": p.codigos_combos,
                "Códigos Plus": p.codigos_plus,
                "Serie": p.nombre_serie,
            }));

            // 4. Convertir productosFiltrados a array de arrays (con encabezado)
            let wsProductos = XLSX.utils.json_to_sheet(productosFiltrados);
            let dataProductos = XLSX.utils.sheet_to_json(wsProductos, {
                header: 1
            });

            // 5. Combinar todo: resumen + línea vacía + productos
            let dataFinal = [...dataResumen, [], ...dataProductos];

            // 6. Crear hoja final
            let wsFinal = XLSX.utils.aoa_to_sheet(dataFinal);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, wsFinal, "Reporte");

            // 7. Descargar el archivo
            XLSX.writeFile(wb, me.nombrearchivo_descarga + '.xlsx');
        },
    },
};
</script>

<style scoped>
.stylevalidarinput {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

.estilo-borde {
    border: 2px solid #007bff;
    /* azul intenso */
    border-radius: 8px;
    padding: 16px;
    margin-top: 2px;
    /* background-color: #f0f8ff; */
    /* azul muy claro */
}

.texto-claro {
    color: #333;
    font-size: 14px;
}

.botones-reporte {
    display: flex;
    justify-content: center;
    gap: 1rem;
    /* espacio entre botones */
    flex-wrap: wrap;
    /* se adapta si el espacio es muy pequeño */
    margin-top: 1rem;
}

.botones-reporte .vs-button {
    flex: 0 0 48%;
    /* cada uno ocupa 48% del ancho con 2% de espacio en total */
}
</style>
