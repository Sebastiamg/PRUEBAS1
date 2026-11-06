<template>
<div>
    <!-- Botones PDF/Excel + Columnas -->
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;margin-top:1rem;">
        <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" @click="m_imprimirTodos('12px', nombrearchivo_descarga, '0px', '', 'landscape')" style="flex:0 0 48%;">
            Descargar Reporte Pdf
        </vs-button>
        <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" @click="ExportToExcel" style="flex:0 0 48%;">
            Descargar Reporte Excel
        </vs-button>
        <!-- Dropdown de columnas -->
        <div style="position:relative; flex:0 0 48%;">
            <vs-button type="border" color="primary" @click="showDropdown = !showDropdown" style="width:100%;">
                Mover, editar, ocultar o añadir columnas
                <i class="feather icon-chevron-down" style="margin-left:0.5rem;"></i>
            </vs-button>
            <!-- Contenedor del dropdown -->
            <div v-if="showDropdown" style="position:absolute;top:100%;left:0;background:#fff;border:1px solid #ccc;
            z-index:1000;width:100%;max-height:350px;overflow:auto;padding:0.5rem;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                <!-- 🔍 Buscador -->
                <input v-model="filtroColumnas" placeholder="Buscar columna..." style="width:100%;padding:6px 8px;margin-bottom:0.5rem;border:1px solid #ccc;border-radius:4px;font-size:13px;" />
                <!-- Draggable -->
                <draggable v-model="columnasTabla" handle=".handle" tag="div">
                    <div v-for="col in columnasTabla" :key="col.key" v-if="col.label.toLowerCase().includes(filtroColumnas.toLowerCase())">
                        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;cursor:grab;">
                            <span class="handle" style="margin-right:0.25rem;">&#x2630;</span>
                            <input type="checkbox" v-model="col.visible" />
                            <span>{{ col.label }}</span>
                            <!-- ✏️ Botón editar -->
                            <vx-tooltip text="Cambiar nombre de la columna" position="top">
                                <vs-button icon-pack="feather" icon="icon-edit" type="flat" size="small" color="primary" @click.stop="abrirPopupEditar(col)">
                                </vs-button>
                            </vx-tooltip>
                        </div>
                    </div>
                </draggable>
            </div>
        </div>
    </div>
    <!-- 🪶 Popup para editar nombre de columna -->
    <vs-popup :active.sync="popupEditar" title="Editar nombre de la columna">
        <div style="padding:20px; text-align:center;">
            <!-- Input centrado con margen inferior -->
            <vs-input v-model="columnaEditando.label" placeholder="Nuevo nombre de la columna" style="display:inline-block; width:80%; margin-bottom:20px;"></vs-input>
            <!-- Botones centrados con separación -->
            <div style="margin-top:1rem; text-align:center;">
                <vs-button color="primary" type="relief" @click="guardarColumna">Guardar</vs-button>&emsp;
                <vs-button color="danger" type="relief" @click="popupEditar=false">Cancelar</vs-button>
            </div>
        </div>
    </vs-popup>
    <!-- Tabla -->
    <vx-card id="seccionImprimir2" v-if="InstitucionesReporte.length > 0" align="center" style="margin-top:1rem;">
        <!-- Contenedor responsive con scroll horizontal si es necesario -->
        <div style="overflow-x:auto; width:100%;">
            <table width="100%" border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; table-layout:fixed; max-width:100%; word-wrap:break-word;">
                <thead>
                    <tr>
                        <th v-for="col in columnasTabla" v-if="col.visible" :key="col.key" style="border:1px solid #000; font-weight:bold; text-align:center; padding:6px;">
                            {{ col.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="inst in InstitucionesReporte" :key="inst.idInstitucion">
                        <td v-for="col in columnasTabla" v-if="col.visible" :key="col.key" style="border:1px solid #000; font-weight:bold; text-align:center; padding:6px; word-wrap:break-word;">
                            {{ inst[col.key] != null ? inst[col.key] : '-' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </vx-card>
</div>
</template>

<script>
import draggable from "vuedraggable";
import imprimirMixin from "@/mixins/Pedidosmix.js";
import * as XLSX from "xlsx";

export default {
    mixins: [imprimirMixin],
    components: {
        draggable
    },
    data() {
        return {
            InstitucionesReporte: [],
            nombrearchivo_descarga: "Reporte_Instituciones",
            showDropdown: false,
            columnasTabla: [],
            filtroColumnas: "",
            popupEditar: false,
            columnaEditando: {},
        };
    },
    mounted() {
        this.getInstitucionesReporte();
    },
    methods: {
        getInstitucionesReporte() {
            let me = this;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + "Reporte_Instituciones")
                .then((res) => {
                    this.InstitucionesReporte = res.data;
                    if (res.data.length > 0) {
                        let first = res.data[0];
                        this.columnasTabla = Object.keys(first).map((key) => ({
                            key: key,
                            label: key,
                            visible: [
                                "nombreInstitucion",
                                "ultimo_periodo_trabajado",
                                "asesorinstitucion",
                                "nombre_provincia",
                                "nombre_ciudad",
                                "nombre_parroquia",
                                "direccionInstitucion",
                                "telefonoInstitucion",
                                "ruc",
                                "fecha_fundacion",
                                "email",
                            ].includes(key),
                        }));
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },

        // 🪶 Abre el popup con el nombre actual
        abrirPopupEditar(col) {
            this.columnaEditando = {
                ...col
            };
            this.popupEditar = true;
        },

        // 💾 Guarda el nuevo nombre de la columna
        guardarColumna() {
            const col = this.columnasTabla.find(
                (c) => c.key === this.columnaEditando.key
            );
            if (col && this.columnaEditando.label.trim() !== "") {
                col.label = this.columnaEditando.label.trim();
                this.$vs.notify({
                    title: 'Columna actualizada',
                    text: `Nuevo nombre: ${col.label}`,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle'
                });
            }
            this.popupEditar = false;
        },

        ExportToExcel() {
            let columnasVisibles = this.columnasTabla.filter((c) => c.visible);
            let dataFiltrada = this.InstitucionesReporte.map((p) => {
                let obj = {};
                columnasVisibles.forEach((col) => {
                    obj[col.label] = p[col.key] != null ? p[col.key] : "-";
                });
                return obj;
            });
            let ws = XLSX.utils.json_to_sheet(dataFiltrada);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Reporte");
            XLSX.writeFile(wb, this.nombrearchivo_descarga + ".xlsx");
        },
    },
};
</script>

<style scoped>
.botones-reporte .vs-button {
    flex: 0 0 48%;
}
</style>
