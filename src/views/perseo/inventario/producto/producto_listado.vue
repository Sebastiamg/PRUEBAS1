<template>
<div class="perseo-tabla-container">
    <!-- Header con búsqueda y controles -->
    <div class="tabla-header">
        <div class="header-left">
            <div class="chip-info">
                <i class="fa-solid fa-database"></i>
                <span>Total de registros: <strong>{{ datosFiltrados.length }}</strong> / {{ array_Productos.length }}</span>
            </div>
        </div>
        <div class="header-right">
            <div class="search-box">
                <i class="fa-solid fa-search"></i>
                <input v-model="busquedaGlobal" type="text" placeholder="Buscar en todos los campos..." class="search-input" />
                <i v-if="busquedaGlobal" class="fa-solid fa-times clear-icon" @click="busquedaGlobal = ''"></i>
            </div>
            <div class="items-per-page">
                <label>Mostrar:</label>
                <select v-model.number="itemsPorPagina">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                    <option :value="array_Productos.length">Todos</option>
                </select>
            </div>
        </div>
    </div>

    <!-- Tabla -->
    <div class="tabla-wrapper">
        <table class="perseo-tabla">
            <thead>
                <tr>
                    <!-- Columnas dinámicas -->
                    <th v-for="(columna, index) in columnas" :key="index" :style="{ width: columna.width || 'auto' }" :class="{ 'sortable': columna.sortable !== false }" @click="columna.sortable !== false && ordenarPor(columna.field)">
                        <div class="th-content">
                            <span class="th-label">{{ columna.label }}</span>
                            <div class="th-icons">
                                <i v-if="columna.sortable !== false" class="fa-solid sort-icon" :class="{
                      'fa-sort': ordenColumna !== columna.field,
                      'fa-sort-up': ordenColumna === columna.field && ordenDireccion === 'asc',
                      'fa-sort-down': ordenColumna === columna.field && ordenDireccion === 'desc'
                    }"></i>
                                <i v-if="columna.filtrable !== false" class="fa-solid fa-filter filter-icon" :class="{ 'active': filtrosPorColumna[columna.field] }" @click.stop="toggleFiltroColumna(columna.field)"></i>
                            </div>
                        </div>
                    </th>
                </tr>
                <!-- Fila de filtros -->
                <tr class="filter-row">
                    <!-- Filtros por columna -->
                    <th v-for="(columna, index) in columnas" :key="`filter-${index}`" class="filter-cell">
                        <div v-if="filtrosVisibles[columna.field] && columna.filtrable !== false" class="filter-wrapper">
                            <input v-model="filtrosPorColumna[columna.field]" type="text" :placeholder="`Filtrar ${columna.label}...`" class="filter-input" @keyup.enter="filtrosVisibles[columna.field] = false" @click.stop />
                            <i class="fa-solid fa-times close-filter-icon" @click="cerrarFiltroColumna(columna.field)"></i>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(fila, index) in datosPaginados" :key="index" @dblclick="$emit('editar-producto', fila.productosid)" class="cursor-pointer">
                    <!-- Celdas dinámicas -->
                    <td v-for="(columna, colIndex) in columnas" :key="colIndex" :class="columna.tdClass">
                        {{ formatearValor(fila, columna) }}
                    </td>
                </tr>
                <!-- Mensaje cuando no hay datos -->
                <tr v-if="datosFiltrados.length === 0">
                    <td :colspan="columnas.length" class="no-data">
                        <i class="fa-solid fa-inbox"></i>
                        <p>No se encontraron registros</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Paginación -->
    <div class="tabla-footer" v-if="datosFiltrados.length > 0">
        <div class="footer-info">
            Mostrando {{ rangoInicio }} - {{ rangoFin }} de {{ datosFiltrados.length }} registros
        </div>
        <div class="pagination">
            <button class="page-btn" :disabled="paginaActual === 1" @click="irAPagina(1)">
                <i class="fa-solid fa-angles-left"></i>
            </button>
            <button class="page-btn" :disabled="paginaActual === 1" @click="irAPagina(paginaActual - 1)">
                <i class="fa-solid fa-angle-left"></i>
            </button>
            <button v-for="pagina in paginasVisibles" :key="pagina" class="page-btn" :class="{ 'active': pagina === paginaActual }" @click="irAPagina(pagina)">
                {{ pagina }}
            </button>
            <button class="page-btn" :disabled="paginaActual === totalPaginas" @click="irAPagina(paginaActual + 1)">
                <i class="fa-solid fa-angle-right"></i>
            </button>
            <button class="page-btn" :disabled="paginaActual === totalPaginas" @click="irAPagina(totalPaginas)">
                <i class="fa-solid fa-angles-right"></i>
            </button>
        </div>
    </div>
</div>
</template>

<script>
import Generalmix from '../../../../mixins/Generalmix';

export default {
    mixins: [Generalmix],

    data() {
        return {
            array_Productos: [],
            array_Almacenes: [],
            columnas: [],
            // Estados de la tabla
            busquedaGlobal: '',
            filtrosPorColumna: {},
            filtrosVisibles: {},
            ordenColumna: null,
            ordenDireccion: 'asc',
            paginaActual: 1,
            itemsPorPagina: 10
        };
    },

    props: {
        id_empresa: {
            type: Number,
            default: null
        },
        isEditMode: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        datosFiltrados() {
            let resultado = [...this.array_Productos];

            // Búsqueda global
            if (this.busquedaGlobal) {
                const busqueda = this.busquedaGlobal.toLowerCase();
                resultado = resultado.filter(fila => {
                    return this.columnas.some(columna => {
                        const valor = this.obtenerValorCelda(fila, columna.field);
                        return String(valor).toLowerCase().includes(busqueda);
                    });
                });
            }
            // Filtros por columna
            Object.keys(this.filtrosPorColumna).forEach(field => {
                const filtro = this.filtrosPorColumna[field];
                if (filtro) {
                    const filtroLower = filtro.toLowerCase();
                    resultado = resultado.filter(fila => {
                        const valor = this.obtenerValorCelda(fila, field);
                        return String(valor).toLowerCase().includes(filtroLower);
                    });
                }
            });
            // Ordenamiento
            if (this.ordenColumna) {
                resultado.sort((a, b) => {
                    const valorA = this.obtenerValorCelda(a, this.ordenColumna);
                    const valorB = this.obtenerValorCelda(b, this.ordenColumna);

                    let comparacion = 0;
                    if (valorA > valorB) comparacion = 1;
                    if (valorA < valorB) comparacion = -1;

                    return this.ordenDireccion === 'asc' ? comparacion : -comparacion;
                });
            }
            return resultado;
        },

        totalPaginas() {
            return Math.ceil(this.datosFiltrados.length / this.itemsPorPagina);
        },

        datosPaginados() {
            const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
            const fin = inicio + this.itemsPorPagina;
            return this.datosFiltrados.slice(inicio, fin);
        },

        rangoInicio() {
            return ((this.paginaActual - 1) * this.itemsPorPagina) + 1;
        },

        rangoFin() {
            const fin = this.paginaActual * this.itemsPorPagina;
            return fin > this.datosFiltrados.length ? this.datosFiltrados.length : fin;
        },

        paginasVisibles() {
            const paginas = [];
            const maxVisible = 5;
            let inicio = Math.max(1, this.paginaActual - Math.floor(maxVisible / 2));
            let fin = Math.min(this.totalPaginas, inicio + maxVisible - 1);
            if (fin - inicio < maxVisible - 1) {
                inicio = Math.max(1, fin - maxVisible + 1);
            }
            for (let i = inicio; i <= fin; i++) {
                paginas.push(i);
            }
            return paginas;
        }
    },

    watch: {
        datosFiltrados() {
            if (this.paginaActual > this.totalPaginas) {
                this.paginaActual = 1;
            }
        }
    },

    mounted() {
        this.perseo_productos_consulta();
    },

    methods: {
        // ============================
        // CONSULTA DE PRODUCTOS
        // ============================
        async perseo_productos_consulta() {
            try {
                const enviardata = {
                    action: 'productos_consulta_todo',
                    id_empresa: this.empresaPerseo.id
                };
                this.$vs.loading();
                const response = await this.$http.post(
                    this.$server_url + 'api/perseo/productos/Procesar_MetodosPost_Productos',
                    enviardata
                );
                this.$vs.loading.close();
                if (!response.data || !response.data.productos) {
                    this.m_message('Respuesta inválida del servidor', 'error');
                    return;
                }
                // 1️⃣ ASIGNAR DATOS CRUDOS
                this.array_Productos = response.data.productos;
                this.array_Almacenes = response.data.almacenes || [];
                // 2️⃣ NORMALIZAR (crear _existencias_map)
                await this.normalizarExistencias();
                // 3️⃣ ESPERAR A QUE VUE RENDERICE LOS CAMBIOS
                await this.$nextTick();
                // 4️⃣ ARMAR COLUMNAS (YA EXISTE TODO)
                this.armarColumnasProductos();
                if (this.array_Productos.length === 0) {
                    this.m_message('No se encontraron productos', 'warning');
                }
            } catch (error) {
                this.$vs.loading.close();
                this.m_message('Hubo problemas al traer los datos', 'error');
                console.error(error);
            }
        },

        normalizarExistencias() {
            return new Promise(resolve => {
                this.array_Productos.forEach(prod => {
                    let totalExistencia = 0;
                    this.array_Almacenes.forEach(alm => {
                        // nombre de campo plano (seguro)
                        const fieldName = 'EXIST_' + alm.almacen.replace(/\s+/g, '_');
                        let valor = 0;
                        if (Array.isArray(prod.almacenes_x_producto)) {
                            const item = prod.almacenes_x_producto.find(
                                a => a.almacen === alm.almacen
                            );
                            valor = item ? Number(item.existencias) : 0;
                        }
                        // 🔑 campo directo en el producto
                        this.$set(prod, fieldName, valor);
                        totalExistencia += valor;
                    });
                    this.$set(prod, 'EXISTENCIA_TOTAL', totalExistencia);

                    // ---- TARIFAS (Precio 1, 2, 3) ----
                    let p1 = 0,
                        p2 = 0,
                        p3 = 0;
                    if (Array.isArray(prod.tarifas)) {
                        const t1 = prod.tarifas.find(t => t.tarifadescripcion === 'Precio 1');
                        if (t1) p1 = Number(t1.precioiva);

                        const t2 = prod.tarifas.find(t => t.tarifadescripcion === 'Precio 2');
                        if (t2) p2 = Number(t2.precioiva);

                        const t3 = prod.tarifas.find(t => t.tarifadescripcion === 'Precio 3');
                        if (t3) p3 = Number(t3.precioiva);
                    }
                    this.$set(prod, 'PRECIO_1', p1);
                    this.$set(prod, 'PRECIO_2', p2);
                    this.$set(prod, 'PRECIO_3', p3);
                });
                resolve();
            });
        },

        armarColumnasProductos() {
            let cols = [{
                    label: 'ID',
                    field: 'productosid',
                    sortable: true
                },
                {
                    label: 'Código',
                    field: 'productocodigo',
                    sortable: true
                },
                {
                    label: 'Barras',
                    field: 'barras',
                    sortable: true
                },
                {
                    label: 'Descripción',
                    field: 'descripcion',
                    sortable: true
                },
                {
                    label: 'Línea',
                    field: 'descripcion_lineas',
                    sortable: true
                },
                {
                    label: 'Categoría',
                    field: 'descripcion_categoria',
                    sortable: true
                },
                {
                    label: 'Subcategoría',
                    field: 'descripcion_subcategoria',
                    sortable: true
                },
                {
                    label: 'Subgrupo',
                    field: 'descripcion_subgrupo',
                    sortable: true
                }
            ];
            // ALMACENES (campos planos)
            this.array_Almacenes.forEach(alm => {
                const fieldName = 'EXIST_' + alm.almacen.replace(/\s+/g, '_');

                cols.push({
                    label: alm.almacen,
                    field: fieldName,
                    sortable: false
                });
            });

            // TOTAL EXISTENCIA
            cols.push({
                label: 'EXISTENCIA TOTAL',
                field: 'EXISTENCIA_TOTAL',
                sortable: true
            });

            // PRECIOS
            cols.push({
                label: 'Precio 1',
                field: 'PRECIO_1',
                sortable: true
            }, {
                label: 'Precio 2',
                field: 'PRECIO_2',
                sortable: true
            }, {
                label: 'Precio 3',
                field: 'PRECIO_3',
                sortable: true
            });

            cols.push({
                label: 'Costo',
                field: 'costoactual',
                sortable: true
            }, {
                label: 'IVA',
                field: 'porcentajeiva',
                sortable: true
            }, {
                label: 'Estado',
                field: 'estado',
                sortable: true,
                format: val => val ? 'Activo' : 'Inactivo'
            }, {
                label: 'Ecommerce',
                field: 'ecommerce_estado',
                sortable: true,
                format: val => val === 1 ? 'Visible' : 'No visible'
            });
            this.columnas = cols;
        },

        // ============================
        // MÉTODOS DE TABLA
        // ============================
        obtenerValorCelda(fila, field) {
            const valor = field.split('.').reduce(function (obj, key) {
                if (obj && obj[key] !== undefined && obj[key] !== null) {
                    return obj[key];
                }
                return undefined;
            }, fila);
            if (typeof valor === 'number') {
                return valor;
            }
            if (valor === undefined || valor === null) {
                return 0;
            }
            return valor;
        },

        formatearValor(fila, columna) {
            const valor = this.obtenerValorCelda(fila, columna.field);
            if (columna.format && typeof columna.format === 'function') {
                return columna.format(valor, fila);
            }
            return valor;
        },

        ordenarPor(field) {
            if (this.ordenColumna === field) {
                this.ordenDireccion = this.ordenDireccion === 'asc' ? 'desc' : 'asc';
            } else {
                this.ordenColumna = field;
                this.ordenDireccion = 'asc';
            }
        },

        toggleFiltroColumna(field) {
            this.$set(this.filtrosVisibles, field, !this.filtrosVisibles[field]);
        },

        cerrarFiltroColumna(field) {
            this.$set(this.filtrosPorColumna, field, '');
            this.$set(this.filtrosVisibles, field, false);
        },

        irAPagina(pagina) {
            if (pagina >= 1 && pagina <= this.totalPaginas) {
                this.paginaActual = pagina;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.perseo-tabla-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.tabla-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
    gap: 1rem;
    flex-wrap: wrap;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.chip-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #1e3c72;
    color: white;
    border-radius: 20px;
    font-size: 0.85rem;

    i {
        font-size: 0.9rem;
    }

    strong {
        font-weight: 700;
    }
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    justify-content: flex-end;
}

.search-box {
    position: relative;
    flex: 1;
    max-width: 400px;

    i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: #6c757d;
        font-size: 0.9rem;

        &.fa-search {
            left: 12px;
        }

        &.clear-icon {
            right: 12px;
            cursor: pointer;
            transition: color 0.2s;

            &:hover {
                color: #dc3545;
            }
        }
    }
}

.search-input {
    width: 100%;
    padding: 0.6rem 2.5rem;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s;

    &:focus {
        outline: none;
        border-color: #1e3c72;
        box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
    }
}

.items-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
        font-size: 0.85rem;
        color: #495057;
        font-weight: 500;
    }

    select {
        padding: 0.5rem 0.75rem;
        border: 2px solid #dee2e6;
        border-radius: 6px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;

        &:focus {
            outline: none;
            border-color: #1e3c72;
        }
    }
}

.tabla-wrapper {
    overflow-x: auto;
    max-height: 600px;
    overflow-y: auto;
}

.perseo-tabla {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;

    thead {
        position: sticky;
        top: 0;
        z-index: 10;
        background: #f1f3f5;

        th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.85rem;
            color: #2c3e50;
            border-bottom: 2px solid #dee2e6;
            border-right: 1px solid #dee2e6;
            background: #f1f3f5;
            user-select: none;
            position: relative;

            &:last-child {
                border-right: none;
            }

            &.sortable {
                cursor: pointer;

                &:hover {
                    background: #e9ecef;
                }
            }
        }
    }

    tbody {
        tr {
            transition: all 0.2s;
            border-bottom: 2px solid #e9ecef;

            &:hover {
                background: #f8f9fa;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            td {
                padding: 0.9rem 1rem;
                font-size: 0.9rem;
                color: #495057;
                border-right: 1px solid #f1f3f5;
                border-bottom: 1px solid #e9ecef;

                &:last-child {
                    border-right: none;
                }

                &.no-data {
                    text-align: center;
                    padding: 3rem;
                    color: #6c757d;

                    i {
                        font-size: 3rem;
                        margin-bottom: 1rem;
                        opacity: 0.3;
                    }

                    p {
                        margin: 0;
                        font-size: 1rem;
                    }
                }
            }
        }
    }
}

.th-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.th-label {
    flex: 1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.th-icons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sort-icon {
    font-size: 0.75rem;
    color: #adb5bd;
    transition: color 0.2s;

    &.fa-sort-up,
    &.fa-sort-down {
        color: #1e3c72;
    }
}

.filter-icon {
    font-size: 0.75rem;
    color: #adb5bd;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0.25rem;
    border-radius: 4px;

    &:hover {
        background: rgba(30, 60, 114, 0.1);
        color: #1e3c72;
    }

    &.active {
        color: #1e3c72;
        background: rgba(30, 60, 114, 0.15);
    }
}

.filter-row {
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;

    .filter-cell {
        padding: 0.5rem 1rem;
        border-bottom: none;
    }
}

.filter-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    border: 2px solid #1e3c72;
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
}

.filter-input {
    flex: 1;
    padding: 0.4rem 0.5rem;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
    width: 100%;

    &:focus {
        outline: none;
    }

    &::placeholder {
        color: #adb5bd;
    }
}

.close-filter-icon {
    cursor: pointer;
    color: #6c757d;
    font-size: 0.75rem;
    transition: color 0.2s;
    padding: 0.25rem;

    &:hover {
        color: #dc3545;
    }
}

.tabla-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border-top: 2px solid #e9ecef;
    flex-wrap: wrap;
    gap: 1rem;
}

.footer-info {
    font-size: 0.85rem;
    color: #495057;
}

.pagination {
    display: flex;
    gap: 0.25rem;
}

.page-btn {
    padding: 0.5rem 0.75rem;
    border: 1px solid #dee2e6;
    background: white;
    color: #495057;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
    min-width: 36px;

    &:hover:not(:disabled) {
        background: #f8f9fa;
        border-color: #1e3c72;
        color: #1e3c72;
    }

    &.active {
        background: #1e3c72;
        color: white;
        border-color: #1e3c72;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    i {
        font-size: 0.75rem;
    }
}

@media (max-width: 768px) {
    .tabla-header {
        flex-direction: column;
        align-items: stretch;
    }

    .header-right {
        flex-direction: column;
        align-items: stretch;
    }

    .search-box {
        max-width: 100%;
    }
}
</style>
