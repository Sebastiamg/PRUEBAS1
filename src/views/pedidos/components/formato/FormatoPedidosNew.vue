FormatoPedidosNew.vue
<template>
<div>
    <div class="flex justify-end">
        <vs-button color="primary" v-if="activeMenu" style="position: relative;right: 15px;" icon="close" @click="activeMenu = false;" type="flat"></vs-button>
        <vs-button color="primary" v-if="activeMenu == false" style="position: relative;right: 15px;" icon="check" @click="activeMenu = true;" type="flat">Mostrar series</vs-button>
    </div>
    <div id="menuSerie">
        <div class="flex" style="flex-wrap:wrap">
            <vs-button type="border" icon="book" class="m-3" v-for="(tr,key) in arregloSeries" :key="key" @click="serie=tr;getBooks(tr)"> {{ capitalizarPrimeraLetra(tr.nombre_serie) }}</vs-button>
            <!-- <div style="border:1px solid #ccc;padding:3px;margin:3px;" v-for="(tr,key) in arregloSeries" :key="key" class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5 p-6 flex justify-between flex-row-reverse items-center">
                        <span  class="inline-flex rounded-full feather-icon select-none relative text-primary" style="background: rgba(var(--vs-primary),.15);border:1px solid #ccc;">
                            <svg fill="#000000" width="28px" height="28px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <title>book</title>
                            <path d="M30.728 18.612l-2.112-0.697 0.050 0.052-11.683 4.24-11.184-11.823-2.745-0.906c-1.386 0.981-1.541 3.774-0.61 4.746l13.805 14.19 14.602-5.228c-1.33-0.727-2.409-2.796-0.123-4.573zM15.474 22.441l-11.504-11.928h0.344l11.453 11.693-0.294 0.235zM16.353 27.987c0 0-1.592-1.86 0.471-4.334l12.501-4.527c0 0-1.438 2.469 0.245 3.927l-13.217 4.935zM5.799 10.384l-0.382-0.404 11.654-4.138 11.544 12.073 2.112 0.697c-0.010 0.008-0.020 0.016-0.030 0.024l0.246-0.088-13.623-14.125-14.212 5.072 2.69 0.888z"></path>
                            </svg>
                        </span>
                        <div class="truncate titleBook" @click="serie=tr;getBooks(tr)" style="border:1px solid #ccc;">
                            <h6 style="font-size: 11px;" class="mb-1 font-bold"> {{ capitalizarPrimeraLetra(tr.nombre_serie) }}</h6>
                        </div>
                    </div> -->
        </div>
    </div>
    <div v-if="arregloLibros.length > 0">
        <vs-divider>Sección libros:</vs-divider>
        <div align="center">
            <table>
                <tr>
                    <td>
                        <b style="font-size: 20px;">{{ capitalizarPrimeraLetra(serie.nombre_serie) }}</b>
                    </td>
                </tr>
            </table>
        </div>
        <!--PLAN LECTOR-->
        <vs-table max-items="15" v-if="serie.id_serie == 6" stripe search pagination :data="arregloLibros">
            <template slot="header">
                <vs-chip color="primary"> {{ capitalizarPrimeraLetra(serie.nombre_serie) }} | Cantidad: <b class="ml-1"> {{ arregloLibros.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th width="800" style="border: 1px solid #f2f2f2; font-weight: bold;">Libros</vs-th>
                <vs-th width="200" style="border: 1px solid #f2f2f2; font-weight: bold;">Estado</vs-th>
                <vs-th width="200" style="border: 1px solid #f2f2f2; font-weight: bold;">Precio</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td style="background-color: #ECF5F8;color:black;border: none;">
                        {{tr.nombrelibro}} [{{tr.codigo_liquidacion}}]<br>
                    </vs-td>
                    <vs-td>
                        <vs-tooltip :text="tr.pfn_estado ? 'Inactivar' : 'Activar'" position="top" :color="tr.pfn_estado ? 'warning' : 'success'">
                            <template>‎</template>
                            <vs-checkbox @click.native="actualizarFormato(1)" v-model="tr.pfn_estado" label="Checkbox" @change="handleCheckboxChange_SP(arregloLibros,tr)" />
                        </vs-tooltip>
                    </vs-td>
                    <vs-td>
                        <div style="width: 130px;">
                            <vs-input placeholder="Precio" class="w-full" @click="verificar_formato = 2" icon="mode_edit" v-model="tr.pfn_pvp" @blur="blur_fnp_pvp_SP(arregloLibros,tr)" @keypress="validarkey_pfn_pvp_SP($event, indextr)" @paste="validatePaste" :disabled="!tr.pfn_estado" />
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--LIBROS NORMALES-->
        <div v-else>
            <div v-if="serie.id_serie == 19" class="px-4 py-2" style="max-width: 680px; margin: 0 auto;">
              <!-- Radio buttons para el modo de búsqueda -->
              <div style="display: flex; gap: 20px; margin-bottom: 10px; user-select: none;">
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 500; color: #2c7be5;">
                  <input type="radio" v-model="modo_busqueda_combo" value="combo" @change="limpiarBusqueda" style="accent-color: #2c7be5;">
                  🔍 Buscar por Combo
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 500; color: #28a745;">
                  <input type="radio" v-model="modo_busqueda_combo" value="individual" @change="limpiarBusqueda" style="accent-color: #28a745;">
                  📖 Buscar por Libro Individual
                </label>
              </div>

              <!-- Modo: Búsqueda por Combo -->
              <template v-if="modo_busqueda_combo === 'combo'">
                <div data-combo-select-ref>
                  <v-select @input="handleSearchChange" style="width: 100%;" placeholder="--Buscar y seleccionar--" v-model="codigos_combo_buscar" label="nombreCompleto" class="mb-4" :options="productos_Libros_Series" :reduce="(productos_Libros_Series) => productos_Libros_Series.codigo_liquidacion" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #2c7be5; font-size: 14px; font-weight: 500; font-style: normal; user-select: none;">
                    <i class="fas fa-info-circle" aria-hidden="true" style="font-size: 16px;"></i>
                    <span>Selecciona un combo para buscar. El sistema resaltará y te llevará a la coincidencia.</span>
                </div>
                <div v-if="searchNotFound" style="color: red; font-weight: bold; padding: 10px; border: 1px solid red; border-radius: 5px; background: #fff5f5; margin-bottom: 10px;">
                    No se encontraron resultados en el listado para esta búsqueda.
                </div>
                <!-- Barra sticky combo: ir al filtro -->
                <div v-if="codigos_combo_buscar" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; background: linear-gradient(135deg,#1a56db,#2c7be5); border-radius: 14px; padding: 10px 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 6px 24px rgba(44,123,229,0.5); user-select: none;">
                  <span style="font-weight: 600; color: #fff; font-size: 13px; flex: 0 0 220px; width: 220px; white-space: normal; word-break: break-word; line-height: 1.2; max-height: 40px; overflow-y: auto; overflow-x: hidden; display: block; padding-right: 4px;">
                    🔍 {{ (productos_Libros_Series.find(p => p.codigo_liquidacion === codigos_combo_buscar) || {}).nombre || codigos_combo_buscar }}
                  </span>
                  <button @click="irAlFiltroCombo" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; padding: 5px 14px; cursor: pointer; font-size: 13px; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.35)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    ✏️ Seleccionar otro combo
                  </button>
                  <button @click="limpiarBusqueda" style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,80,80,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    ✖
                  </button>
                </div>
              </template>

              <!-- Modo: Búsqueda por Libro Individual -->
              <template v-if="modo_busqueda_combo === 'individual'">
                <div data-individual-select-ref>
                  <v-select @input="handleIndividualSearchChange" style="width: 100%;" placeholder="--Buscar por libro/s individual/es--" multiple :closeOnSelect="false" v-model="codigos_libro_individual_buscar" label="nombreCompleto" class="mb-4" :options="productos_Libros_Individuales" :reduce="(p) => p.codigo_liquidacion" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #2c7be5; font-size: 14px; font-weight: 500; user-select: none;">
                    <i class="fas fa-info-circle" aria-hidden="true" style="font-size: 16px;"></i>
                    <span>Selecciona uno o varios libros individuales para encontrar los combos que los contengan.</span>
                </div>
                <!-- Barra sticky de navegación -->
                <div v-if="codigos_libro_individual_buscar.length > 0 && searchResultsIndividual.length > 0"
                     style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; background: linear-gradient(135deg,#1a56db,#2c7be5); border-radius: 14px; padding: 10px 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 6px 24px rgba(44,123,229,0.5); user-select: none;">
                  <button @click="navegarResultado(-1)" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; padding: 4px 12px; cursor: pointer; font-size: 16px;">&#9664;</button>
                  <span style="font-weight: 600; color: #fff; font-size: 13px;">
                    Resultado {{ currentIndividualResultIndex + 1 }} de {{ searchResultsIndividual.length }}
                  </span>
                  <button @click="navegarResultado(1)" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; padding: 4px 12px; cursor: pointer; font-size: 16px;">&#9654;</button>
                  <button @click="irAlFiltroIndividual" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; padding: 5px 14px; cursor: pointer; font-size: 13px; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.35)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    ✏️ Añadir/quitar texto/s al filtro
                  </button>
                  <button @click="limpiarBusqueda" style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,80,80,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    ✖
                  </button>
                </div>
                <div v-if="codigos_libro_individual_buscar.length > 0 && searchResultsIndividual.length === 0" style="color: red; font-weight: bold; padding: 10px; border: 1px solid red; border-radius: 5px; background: #fff5f5; margin-bottom: 10px;">
                    No se encontraron combos con esos libros.
                </div>
              </template>
            </div>
            <vs-table max-items="10000" search pagination :data="arregloLibros" @search="handleTableSearch" @change-page="handleTableSearch">
                <template slot="header">
                    <vs-chip color="primary"> {{ capitalizarPrimeraLetra(serie.nombre_serie) }} | Cantidad: <b class="ml-1"> {{ arregloLibros.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th width="1500" style="background-color: #fff;border: 1px solid #f2f2f2;font-weight: bold;">Área</vs-th>
                    <vs-th width="1000" style="border: 1px solid #f2f2f2; font-weight: bold;" colspan="10">Niveles</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr>
                        <vs-td style="height: 0.1px; margin: 0.1px; padding: 2px"></vs-td>
                    </vs-tr>
                    <!-- Mostrar TODAS las ÁREAS y LIBROS (sin ocultar al buscar) -->
                      <vs-tr v-observe-visibility="tr.idarea" :data="tr" :key="serie.id_serie + '_area_' + tr.idarea" v-for="(tr, indextr) in data">
                        <vs-td :class="{'resaltado-area': tr.is_resaltado_area}" style="background-color: #ECF5F8;color:black;border: none;" width="300">
                            {{tr.nombrearea}}<br>
                        </vs-td>
                          <vs-td v-for="(item, key) in tr.libros" :key="key" style="margin: 0px; padding: 4px 2px 4px 2px;" width="1000">
                            <table v-if="visibles[tr.idarea] && item.nivel > 0" style="border: 1.3px double gray; min-height: 120px;" align="center" :class="{'libro-resaltado': item.is_resaltado, 'libro-resaltado-individual': item.is_resaltado_individual}">
                                <tr style="background-color: transparent;" align="center">
                                    <td style="margin: 0px; padding: 0px;">
                                        <div align="center"><span><b>[{{ item.codigo_liquidacion }}]</b></span></div>
                                        <div align="center"><span><b>{{ item.nivel }}</b></span></div>
                                        <div style="float: right;" v-if="serie.id_serie == 19">
                                            <vx-tooltip :text="item.descripcionlibro" position="top" color="primary">
                                                <i class="fas fa-info-circle" style="font-size: 13px; color: #2196f3; cursor: pointer;"></i>
                                            </vx-tooltip>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="serie.id_serie == 19 && item.pro_codigos_desglose && item.pro_codigos_desglose.length > 0">
                                    <td style="padding: 0px; text-align: center;">
                                        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; padding: 2px 4px;">
                                            <vx-tooltip v-for="(combo, idx) in item.pro_codigos_desglose" :key="idx" :text="item.pro_codigos_desglose_regalados && item.pro_codigos_desglose_regalados.some(r => r.codigo_liquidacion === combo.codigo_liquidacion) ? combo.nombrelibro + ' (REGALO)' : combo.nombrelibro" position="top" :color="item.pro_codigos_desglose_regalados && item.pro_codigos_desglose_regalados.some(r => r.codigo_liquidacion === combo.codigo_liquidacion) ? 'success' : 'primary'">
                                                <span :style="item.pro_codigos_desglose_regalados && item.pro_codigos_desglose_regalados.some(r => r.codigo_liquidacion === combo.codigo_liquidacion) ? 'font-size: 11px; padding: 2px 6px; border-radius: 10px; border: 1px solid #28c76f; color: #28c76f; background-color: rgba(40, 199, 111, 0.15); white-space: nowrap; cursor: pointer; line-height: 1.2; font-weight: bold;' : 'font-size: 11px; padding: 2px 6px; border-radius: 10px; border: 1px solid #ccc; color: #333; background-color: transparent; white-space: nowrap; cursor: pointer; line-height: 1.2;'">
                                                    <i v-if="item.pro_codigos_desglose_regalados && item.pro_codigos_desglose_regalados.some(r => r.codigo_liquidacion === combo.codigo_liquidacion)" class="fas fa-gift" style="margin-right: 3px;"></i>
                                                    {{ combo.codigo_liquidacion }}
                                                </span>
                                            </vx-tooltip>
                                        </div>
                                    </td>
                                </tr>
                                <tr style="background-color: transparent;" align="center">
                                    <td align="center" style="padding-top: 2px; padding-bottom: 0;">
                                        <vs-tooltip :text="item.pfn_estado == true ? 'Inactivar' : 'Activar'" position="top" :color="item.pfn_estado ? 'warning' : 'success'">
                                            <template>‎</template>
                                            <vs-checkbox @click.native="actualizarFormato(1)" style="display: inline-flex" v-model="item.pfn_estado" label="Checkbox" @change="handleCheckboxChange_SN(arregloLibros,tr,item)" />
                                        </vs-tooltip>
                                    </td>
                                </tr>
                                <tr style="background-color: transparent;" align="center">
                                    <td>
                                        <div style="width: 90px; margin-bottom: 0.1px; padding: 0px;">
                                            <vs-input placeholder="Precio" class="w-full" v-model="item.pfn_pvp" @click="verificar_formato = 2" @blur="blur_fnp_pvp_SN(arregloLibros,tr,item)" @keypress="validarkey_pfn_pvp_SN($event, item)" @paste="validatePaste" :disabled="!item.pfn_estado" />
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div v-else-if="item.nivel > 0" style="min-height: 120px; min-width: 90px; display: flex; align-items: center; justify-content: center; border: 1.3px double rgba(0,0,0,0.1);">
                                <span style="font-size: 10px; color: #ccc;">Cargando...</span>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
    <!-- <div class="flex justify-center">
        <vs-button color="success" type="relief" @click="guardarLibros()">Guardar libros</vs-button>
    </div> -->
</div>
</template>

<script>
import vSelect from 'vue-select';
export default {
    components: {
        'v-select': vSelect,
    },
    directives: {
        observeVisibility: {
            inserted(el, binding, vnode) {
                const ctx = vnode.context;
                // Asignamos manualmente el indexkey al elemento físico del DOM (ya que Vuesax puede descartar props data-)
                if (binding.value) {
                    el.dataset.indexkey = binding.value;
                }

                // Esperamos un momento para garantizar que el _observer esté creado y el DOM renderizado
                setTimeout(() => {
                    if (ctx && ctx._observer && el) {
                        ctx._observer.observe(el);
                    }
                }, 100);
            },
            update(el, binding, vnode) {
                const ctx = vnode.context;
                if (binding.value) {
                    el.dataset.indexkey = binding.value;
                }
                // Si Vue recicla el nodo DOM pero el estado "visibles" fue reiniciado, forzamos re-evaluación
                setTimeout(() => {
                    if (ctx && ctx._observer && el) {
                        if (ctx.visibles && ctx.visibles[binding.value] === undefined) {
                            ctx._observer.unobserve(el);
                            ctx._observer.observe(el);
                        }
                    }
                }, 50);
            },
            unbind(el, binding, vnode) {
                const ctx = vnode.context;
                if (ctx && ctx._observer && el) {
                    ctx._observer.unobserve(el);
                }
            }
        }
    },
    data() {
        return {
            arregloSeries: [],
            arregloLibros: [],
            arregloEnviar: [],
            serie: {},
            activeMenu: true,
            precioxarea: '',
            verificar_formato: '',
            codigos_combo_buscar: null,
            productos_Libros_Series: [],
            searchNotFound: false,
            modo_busqueda_combo: 'combo',
            codigos_libro_individual_buscar: [],
            productos_Libros_Individuales: [],
            searchResultsIndividual: [],
            currentIndividualResultIndex: 0,
            areaLibroMap: {},
            visibles: {},
            _observer: null,
        }
    },
    props: {
        periodo_id: {
            type: Object,
            default: {},
        },
    },
    watch: {
        docente_id(results) {
            let me = this;
            me.arregloLibros = []
        },
        activeMenu(results) {
            let me = this;
            const container = document.querySelector("#menuSerie");
            if (results == true) {
                container.classList.remove("removeMenu");
            } else {
                container.classList.add("removeMenu");
            }
        }
    },
    mounted() {
        let me = this;
        me.getSeries();
    },
    beforeDestroy() {
        if (this._observer) { this._observer.disconnect(); this._observer = null; }
        if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    },
    methods: {
        initObserver() {
            if (this._observer) return; // Reutilizamos el observer existente
            if (this._rafId) cancelAnimationFrame(this._rafId);
            this._pendingVisible = {};

            this._observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        const key = entry.target.dataset.indexkey;
                        if (!key) return;
                        if (entry.isIntersecting) {
                            // Acumular en lugar de $set inmediato
                            this._pendingVisible[key] = true;
                        }
                    });
                    // Aplicar todos los cambios en un solo frame de render
                    if (this._rafId) cancelAnimationFrame(this._rafId);
                    this._rafId = requestAnimationFrame(() => {
                        if (Object.keys(this._pendingVisible).length === 0) return;
                        const merged = Object.assign({}, this.visibles, this._pendingVisible);
                        this.visibles = merged;   // Una sola asignación reactiva = un solo re-render
                        this._pendingVisible = {};
                    });
                },
                { rootMargin: '200px 0px', threshold: 0 }
            );
            // El bucle de refs se ha eliminado, el directivo v-observe-visibility se encarga ahora.
        },
        actualizarFormato(valor) {
            this.verificar_formato = valor;
        },
        validarkey_pfn_pvp_SN(event, item) {
            // Obtén el valor de `pfn_pvp`
            let pfn_pvp = item.pfn_pvp || '';

            // Verifica si la tecla presionada es un número, coma o punto
            if (!/\d|\.|,/.test(event.key)) {
                event.preventDefault();
                return;
            }

            // Reemplaza comas por puntos solo si hay comas en la cadena
            if (pfn_pvp.includes(',')) {
                pfn_pvp = pfn_pvp.replace(',', '.');
                item.pfn_pvp = pfn_pvp;
            }

            // Valida el formato del número
            if (!/^\d{0,10}(\.\d{0,2})?$/.test(pfn_pvp)) {
                item.pfn_pvp = '';
            }
        },
        validarkey_pfn_pvp_SP(event, index) {
            // Obtén el valor de `pfn_pvp`
            let pfn_pvp = this.arregloLibros[index].pfn_pvp || '';

            // Verifica si la tecla presionada es un número, coma o punto
            if (!/\d|\.|,/.test(event.key)) {
                event.preventDefault();
                return;
            }

            // Reemplaza comas por puntos solo si hay comas en la cadena
            if (pfn_pvp.includes(',')) {
                pfn_pvp = pfn_pvp.replace(',', '.');
                this.arregloLibros[index].pfn_pvp = pfn_pvp;
            }

            // Valida el formato del número
            if (!/^\d{0,10}(\.\d{0,2})?$/.test(pfn_pvp)) {
                this.arregloLibros[index].pfn_pvp = '';
            }
        },
        validatePaste(event) {
            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text/plain');

            // Filtrar solo los números del texto pegado
            const numbersOnly = pastedText.replace(/[^\d]/g, '');

            // Insertar el texto filtrado en la posición del cursor
            document.execCommand("insertText", false, numbersOnly);

            // Prevenir la acción de pegar por defecto
            event.preventDefault();
        },
        async blur_fnp_pvp_SN(arregloLibros, tr, item) {
            let me = this;
            try {
                await me.seteearencero_pfn_pvp_SN(item);
                await me.redondeo_pfn_pvp_SN();
                await me.removeItemFromArr(arregloLibros, tr, item);
                await me.guardarLibros();
                //Metodos finales
            } catch (error) {
                console.error('Error en blur_cantidad:', error);
                me.$vs.loading.close();
            }
        },
        async blur_fnp_pvp_SP(arregloLibros, tr) {
            let me = this;
            try {
                await me.seteearencero_pfn_pvp_SP(tr);
                await me.redondeo_pfn_pvp_SP();
                await me.removeItemFromArrPlanLector(arregloLibros, tr);
                await me.guardarLibros();
                //Metodos finales
            } catch (error) {
                console.error('Error en blur_cantidad:', error);
                me.$vs.loading.close();
            }
        },
        inicializarValores_SN() {
            this.arregloLibros.forEach(tr => {
                tr.libros.forEach(item => {
                    if (!item.selected) {
                        item.pfn_pvp = parseFloat(0).toFixed(2);
                    }
                });
            });
        },
        inicializarValores_SP() {
            this.arregloLibros.forEach(tr => {
                if (!tr.selected) {
                    tr.pfn_pvp = parseFloat(0).toFixed(2);
                }
            });
        },
        async seteearencero_pfn_pvp_SN(item) {
            return new Promise((resolve) => {
                if (!item.pfn_pvp) {
                    item.pfn_pvp = parseFloat(0).toFixed(2);
                }
                resolve(); // Siempre resolver la promesa después de la asignación
            });
        },
        async seteearencero_pfn_pvp_SP(tr) {
            return new Promise((resolve) => {
                if (!tr.pfn_pvp) {
                    tr.pfn_pvp = parseFloat(0).toFixed(2);
                }
                resolve(); // Siempre resolver la promesa después de la asignación
            });
        },
        async redondeo_pfn_pvp_SN() {
            return new Promise((resolve, reject) => {
                try {
                    // Asegúrate de que `this.arregloLibros` esté definido y sea un array
                    if (Array.isArray(this.arregloLibros)) {
                        this.arregloLibros.forEach((tr) => {
                            tr.libros.forEach((pvp) => {
                                if (pvp.pfn_pvp) {
                                    pvp.pfn_pvp = parseFloat(pvp.pfn_pvp).toFixed(2);
                                }
                            });
                        });
                        resolve(); // Resuelve la promesa si todo está bien
                    } else {
                        throw new Error("`this.arregloLibros` no es un array o no está definido");
                    }
                } catch (error) {
                    reject(error); // Rechaza la promesa si hay un error
                }
            });
        },
        async redondeo_pfn_pvp_SP() {
            return new Promise((resolve, reject) => {
                try {
                    // Asegúrate de que `this.arregloLibros` esté definido y sea un array
                    if (Array.isArray(this.arregloLibros)) {
                        this.arregloLibros.forEach((pvp) => {
                            if (pvp.pfn_pvp) {
                                pvp.pfn_pvp = parseFloat(pvp.pfn_pvp).toFixed(2);
                            }
                        });
                        resolve(); // Resuelve la promesa si todo está bien
                    } else {
                        throw new Error("`this.arregloLibros` no es un array o no está definido");
                    }
                } catch (error) {
                    reject(error); // Rechaza la promesa si hay un error
                }
            });
        },
        handleCheckboxChange_SN(arregloLibros, tr, item) {
            this.removeItemFromArr(arregloLibros, tr, item); // Llamar al método que ya tienes definido

            // Establecer pfn_pvp en "0.00" si el checkbox está desmarcado
            if (!item.selected) {
                item.pfn_pvp = parseFloat(0).toFixed(2);
            }
        },
        handleCheckboxChange_SP(arrLibros, tr) {
            this.removeItemFromArrPlanLector(arrLibros, tr); // Llamar al método que ya tienes definido
            // Establecer pfn_pvp en "0.00" si el checkbox está desmarcado
            if (!tr.selected) {
                let me = this
                tr.pfn_pvp = parseFloat(0).toFixed(2);
                tr.pfn_estado = false;
                //obtener la posicion en el arreglo de libros
                const i = arrLibros.indexOf(tr)
                me.arregloLibros[i].formato = 0
            }
        },
        async removeItemFromArr(arrLibros, arr, item) {
            return new Promise((resolve, reject) => {
                try {
                    let me = this
                    //obtener la posicion en el arreglo de libros
                    const i = arrLibros.indexOf(arr)
                    //obtener la posiciones en el arreglo  de area
                    const j = arr.libros.indexOf(item)
                    me.arregloLibros[i].libros[j].formato = 1
                    if (this.verificar_formato == 1) {
                        me.guardarestado_SP(item)
                    }
                    // arr.splice(i, 1)
                    resolve(); // Siempre resolver la promesa después de la asignación
                } catch (error) {
                    reject(error); // Rechaza la promesa si hay un error
                }
            });
        },
        async removeItemFromArrPlanLector(arrLibros, item) {
            return new Promise((resolve, reject) => {
                try {
                    let me = this
                    //obtener la posicion en el arreglo de libros
                    const i = arrLibros.indexOf(item)
                    me.arregloLibros[i].formato = 1
                    if (this.verificar_formato == 1) {
                        me.guardarestado_SP(item)
                    }
                    resolve(); // Siempre resolver la promesa después de la asignación
                } catch (error) {
                    reject(error); // Rechaza la promesa si hay un error
                }
            });
        },
        handleTableSearch() {
            let me = this;
            clearTimeout(this._searchTimer);
            this._searchTimer = setTimeout(() => {
                me.$nextTick(() => {
                    me.initObserver();
                });
            }, 300);
        },
        //para obtener el listado de las series
        getSeries() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getSeries_new')
                .then(function (res) {
                    me.arregloSeries = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        capitalizarPrimeraLetra(cadena) {
            return cadena.charAt(0).toUpperCase() + cadena.slice(1);
        },
        getBooks(tr, opciones) {
            let me = this;
            const preservarFiltros = opciones && opciones.preservarFiltros;
            // Si viene de un guardado (blur/checkbox), NO mover la pantalla al restaurar filtros
            const esGuardado = opciones && opciones.esGuardado;

            // Solo resetear la búsqueda activa si NO estamos preservando filtros
            if (!preservarFiltros) {
                me.codigos_combo_buscar = null;
                me.codigos_libro_individual_buscar = [];
                me.searchResultsIndividual = [];
                me.currentIndividualResultIndex = 0;
            }

            // Guardar estado actual de filtros antes de recargar
            const filtroComboActual = me.codigos_combo_buscar;
            const filtroIndividualActual = [...me.codigos_libro_individual_buscar];
            // Guardar posición de navegación para no perder el lugar al recargar
            const indiceIndividualActual = me.currentIndividualResultIndex;

            if (me.periodo_id == 0) {
                me.$vs.notify({
                    text: 'Seleccione un período por favor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }
            me.$vs.loading();
            var url = ""
            if (me.serie.id_serie == 6) {
                url = this.$server_url + 'areasxSeriePlanLector_FormatoPedido?id_serie=' + me.serie.id_serie + '&periodo_id=' + me.periodo_id.idperiodoescolar
            } else {
                url = this.$server_url + 'areasxSerie_FomatoPedido?id_serie=' + me.serie.id_serie + '&periodo_id=' + me.periodo_id.idperiodoescolar
            }
            this.$http.get(url)
                .then(function (res) {
                    res.data.forEach(tr => {
                        tr.is_resaltado_area = false;
                        if(tr.libros) {
                            tr.libros.forEach(libro => {
                                libro.is_resaltado = false;
                                libro.is_resaltado_individual = false;
                                // Congelar la estructura del desglose (no cambia nunca)
                                // Evita que Vue añada watchers sobre cada elemento del array
                                if (libro.pro_codigos_desglose) {
                                    Object.freeze(libro.pro_codigos_desglose);
                                }
                            });
                        }
                    });

                    me.arregloLibros = res.data
                    if (!esGuardado) {
                        me.visibles = {};
                    }
                    me.$vs.loading.close()
                    if (me.serie.id_serie == 6) {
                        me.inicializarValores_SP();
                    } else if (me.serie.id_serie == 19) {
                        me.armarProductosLibrosSeries(res.data);
                        me.armarProductosLibrosIndividuales();
                        me.inicializarValores_SN();
                        me.$nextTick(() => {
                            me.initObserver();
                            // Re-aplicar filtros si corresponde
                            if (preservarFiltros) {
                                me.codigos_combo_buscar = filtroComboActual;
                                me.codigos_libro_individual_buscar = filtroIndividualActual;
                                if (filtroComboActual) me.handleSearchChange_sinScroll();
                                if (filtroIndividualActual.length) {
                                    me.handleIndividualSearchChange_sinScroll();
                                    // Solo restaurar posición de navegación si NO viene de guardado
                                    if (!esGuardado) {
                                        setTimeout(() => {
                                            if (indiceIndividualActual > 0 && indiceIndividualActual < me.searchResultsIndividual.length) {
                                                me.currentIndividualResultIndex = indiceIndividualActual;
                                                me.enfocarElemento(me.searchResultsIndividual[indiceIndividualActual]);
                                            }
                                        }, 250);
                                    }
                                }
                            }
                        });
                    } else {
                        me.inicializarValores_SN();
                        me.$nextTick(() => {
                            me.initObserver();
                            // Re-aplicar filtros si corresponde
                            if (preservarFiltros) {
                                me.codigos_combo_buscar = filtroComboActual;
                                me.codigos_libro_individual_buscar = filtroIndividualActual;
                                if (filtroComboActual) me.handleSearchChange_sinScroll();
                                if (filtroIndividualActual.length) {
                                    me.handleIndividualSearchChange_sinScroll();
                                    // Solo restaurar posición de navegación si NO viene de guardado
                                    if (!esGuardado) {
                                        setTimeout(() => {
                                            if (indiceIndividualActual > 0 && indiceIndividualActual < me.searchResultsIndividual.length) {
                                                me.currentIndividualResultIndex = indiceIndividualActual;
                                                me.enfocarElemento(me.searchResultsIndividual[indiceIndividualActual]);
                                            }
                                        }, 250);
                                    }
                                }
                            }
                        });
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    // Mostrar error del backend
                    let mensaje = 'Ocurrió un error al obtener los libros';
                    if (error.response && error.response.data && error.response.data.message) {
                        mensaje = error.response.data.message;
                    }
                    me.$vs.notify({
                        title: 'Error',
                        text: mensaje,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 8000
                    });
                    console.error('Error al obtener libros:', mensaje);
                });
        },
        async guardarLibros() {
            let me = this
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            return new Promise((resolve, reject) => {
                me.$vs.loading()
                var envioDatos = []
                if (me.periodo_id == 0) {
                    me.$vs.notify({
                        text: 'Seleccione un período por favor',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return
                }
                me.arregloEnviar = []
                let preEnviar = []
                //PLAN LECTOR
                if (me.serie.id_serie == 6) {
                    preEnviar = me.arregloLibros.filter(p => p.formato == 1)
                }
                //LIBROS NORMALES
                else {
                    me.arregloLibros.forEach(element => {
                        let valores = element.libros.filter(p => p.formato == 1)
                        if (valores.length > 0) {
                            preEnviar.push(valores)
                        }
                    });
                }
                console.log(preEnviar, "preenviar")
                me.arregloEnviar = preEnviar.flat()
                console.log(me.arregloEnviar, "flat")
                //setear false - true del array
                me.arregloEnviar.forEach(element => {
                    var cal = new Object();
                    // cal.nivel           = element.nivel
                    cal.nombrelibro = element.nombrelibro
                    cal.idlibro = element.idlibro
                    cal.pfn_pvp = element.pfn_pvp
                    cal.pfn_id = parseFloat(element.pfn_id)
                    cal.idasignatura = element.idasignatura
                    cal.formato = element.formato
                    if (element.selected == true) {
                        cal.selected = 1
                    } else {
                        cal.selected = 0
                    }
                    envioDatos.push(cal)
                });
                const datosParaGuardar = {
                    periodo: me.periodo_id.idperiodoescolar,
                    user_editor: usuarioObjeto.idusuario,
                    data_libros: envioDatos,
                };
                this.$http.post(this.$server_url + 'Post_GuardarActualizar_formatopedidonew', datosParaGuardar)
                    .then(res => {
                        me.$vs.loading.close()
                        me.getBooks(null, { preservarFiltros: true, esGuardado: true })
                        me.$vs.notify({
                            text: 'Se actualizo el registro correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        resolve(); // Siempre resolver la promesa después de la asignación
                    })
                    .catch((e) => {
                        reject(e); // Rechaza la promesa si hay un error
                        me.$vs.loading.close()
                    })
            });
        },
        guardarestado_SP(tr) {
            let me = this
            if (tr.pfn_id == 0) {
                me.guardarLibros();
            } else {
                if (me.periodo_id == 0) {
                    me.$vs.notify({
                        text: 'Seleccione un período por favor',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return
                }
                // Normalizar pfn_estado a 1/0 correctamente
                tr.pfn_estado = tr.pfn_estado ? 1 : 0;
                const datosParaGuardar = {
                    pfn_estado: tr.pfn_estado,
                    pfn_id: tr.pfn_id,
                };
                me.$vs.loading()
                this.$http.post(this.$server_url + 'ActivarDesactivar_formatopedidonew', datosParaGuardar)
                    .then(res => {
                        me.getBooks(null, { preservarFiltros: true, esGuardado: true })
                        me.$vs.notify({
                            text: 'Se cambio el estado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$vs.loading.close()
                    })
                    .catch((e) => {
                        me.$vs.loading.close()
                    })
            }
        },
        armarProductosLibrosSeries(areas) {
            let me = this;
            me.productos_Libros_Series = [];
            me.areaLibroMap = {};
            let comboMap = new Map();

            if (areas && areas.length > 0) {
                areas.forEach(area => {
                    const areaKey = 'AREA_' + area.idarea;
                    me.areaLibroMap[areaKey] = new Set();

                    // Agregar entrada del área (grupo)
                    me.productos_Libros_Series.push({
                        codigo_liquidacion: areaKey,
                        nombre: area.nombrearea,
                        ifcombo: 2,
                        nombreCompleto: `📁 ${area.nombrearea}`
                    });

                    if (area.libros) {
                        area.libros.forEach(libro => {
                            // Clave compuesta idarea__comboKey para identificar exactamente qué instancia
                            const comboKey = libro.codigos_combos || String(libro.idlibro);
                            if (comboKey) {
                                const compositeKey = String(area.idarea) + '__' + comboKey;
                                me.productos_Libros_Series.push({
                                    codigo_liquidacion: compositeKey,
                                    nombre: libro.nombrelibro,
                                    ifcombo: 1,
                                    nombreCompleto: `   ${libro.nombrelibro} [${libro.codigo_liquidacion}]`
                                });
                                me.areaLibroMap[areaKey].add(comboKey);
                            }
                        });
                    }
                });
            }
            // No ordenamos: mantenemos el orden area → combos del area
        },
        limpiarBusqueda() {
            this.codigos_combo_buscar = null;
            this.codigos_libro_individual_buscar = [];
            this.searchResultsIndividual = [];
            this.currentIndividualResultIndex = 0;
            this.searchNotFound = false;

            this.arregloLibros.forEach(tr => {
                tr.is_resaltado_area = false;
                if(tr.libros) {
                    tr.libros.forEach(libro => {
                        libro.is_resaltado = false;
                        libro.is_resaltado_individual = false;
                    });
                }
            });
        },
        irAlFiltroCombo() {
            const el = document.querySelector('[data-combo-select-ref]');
            if (el) {
                const rect = el.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                window.scrollTo({ top: rect.top + scrollTop - 120, behavior: 'smooth' });
                setTimeout(() => {
                    const vsInput = el.querySelector('input');
                    if (vsInput) vsInput.focus();
                }, 450);
            }
        },
        irAlFiltroIndividual() {
            const el = document.querySelector('[data-individual-select-ref]');
            if (el) {
                const rect = el.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                window.scrollTo({ top: rect.top + scrollTop - 120, behavior: 'smooth' });
                setTimeout(() => {
                    const vsInput = el.querySelector('input');
                    if (vsInput) vsInput.focus();
                }, 450);
            }
        },
        // Versión estándar con scroll: usada cuando el usuario cambia el filtro manualmente
        handleSearchChange() {
            this._aplicarFiltroCombo(true);
        },
        // Versión sin scroll: usada al restaurar filtros luego de un guardado
        handleSearchChange_sinScroll() {
            this._aplicarFiltroCombo(false);
        },
        _aplicarFiltroCombo(conScroll) {
            this.$nextTick(() => {
                let foundAny = false;
                let targetIdArea = null;

                this.arregloLibros.forEach(tr => {
                    tr.is_resaltado_area = (this.codigos_combo_buscar === 'AREA_' + tr.idarea);
                    if (tr.is_resaltado_area) {
                        foundAny = true;
                        targetIdArea = tr.idarea;
                    }
                    if(tr.libros) {
                        tr.libros.forEach(libro => {
                            const comboKey = libro.codigos_combos || String(libro.idlibro);
                            let isMatch = false;
                            if (this.codigos_combo_buscar && !this.codigos_combo_buscar.startsWith('AREA_')) {
                                const parts = this.codigos_combo_buscar.split('__');
                                if (parts.length === 2) {
                                    const [selectedAreaId, selectedComboKey] = parts;
                                    isMatch = (String(tr.idarea) === selectedAreaId && comboKey === selectedComboKey);
                                } else {
                                    isMatch = (this.codigos_combo_buscar === comboKey);
                                }
                            }
                            libro.is_resaltado = isMatch;
                            if (isMatch) {
                                foundAny = true;
                                targetIdArea = tr.idarea;
                            }
                        });
                    }
                });

                this.searchNotFound = !foundAny && !!this.codigos_combo_buscar;

                if (!this.codigos_combo_buscar) {
                    return;
                }

                if (targetIdArea) {
                    this.$set(this.visibles, targetIdArea, true);
                }

                // Solo hacer scroll si el usuario cambió el filtro manualmente
                if (conScroll) {
                    setTimeout(() => {
                        const isArea = typeof this.codigos_combo_buscar === 'string' && this.codigos_combo_buscar.startsWith('AREA_');
                        const selector = isArea ? '.resaltado-area' : '.libro-resaltado';
                        let matchedElements = document.querySelectorAll(selector);
                        if (matchedElements.length > 0) {
                            this.enfocarElemento(matchedElements[0]);
                        }
                    }, 100);
                }
            });
        },
        // Versión estándar con scroll: usada cuando el usuario cambia el filtro manualmente
        handleIndividualSearchChange() {
            this._aplicarFiltroIndividual(true);
        },
        // Versión sin scroll: usada al restaurar filtros luego de un guardado
        handleIndividualSearchChange_sinScroll() {
            this._aplicarFiltroIndividual(false);
        },
        _aplicarFiltroIndividual(conScroll) {
            this.$nextTick(() => {
                let idsSetVisible = new Set();

                if (!this.codigos_libro_individual_buscar || !this.codigos_libro_individual_buscar.length) {
                    this.searchResultsIndividual = [];
                    this.currentIndividualResultIndex = 0;
                    this.arregloLibros.forEach(tr => {
                        if(tr.libros) {
                            tr.libros.forEach(libro => {
                                libro.is_resaltado_individual = false;
                            });
                        }
                    });
                    return;
                }

                this.arregloLibros.forEach(tr => {
                    if(tr.libros) {
                        tr.libros.forEach(libro => {
                            if (!libro.pro_codigos_desglose || !libro.pro_codigos_desglose.length) {
                                libro.is_resaltado_individual = false;
                                return;
                            }
                            const codigosDelCombo = libro.pro_codigos_desglose.map(c => c.codigo_liquidacion);
                            const isMatch = this.codigos_libro_individual_buscar.every(cod => codigosDelCombo.includes(cod));
                            libro.is_resaltado_individual = isMatch;
                            if (isMatch) {
                                idsSetVisible.add(tr.idarea);
                            }
                        });
                    }
                });

                idsSetVisible.forEach(id => {
                    this.$set(this.visibles, id, true);
                });

                setTimeout(() => {
                    let matchedElements = document.querySelectorAll('.libro-resaltado-individual');
                    this.searchResultsIndividual = Array.from(matchedElements);
                    // Solo resetear índice y enfocar si el usuario cambió el filtro manualmente
                    if (conScroll) {
                        this.currentIndividualResultIndex = 0;
                        if (this.searchResultsIndividual.length > 0) {
                            this.enfocarElemento(this.searchResultsIndividual[0]);
                        }
                    }
                }, 100);
            });
        },
        navegarResultado(direccion) {
            if (!this.searchResultsIndividual.length) return;
            this.currentIndividualResultIndex = (this.currentIndividualResultIndex + direccion + this.searchResultsIndividual.length) % this.searchResultsIndividual.length;
            this.enfocarElemento(this.searchResultsIndividual[this.currentIndividualResultIndex]);
        },
        armarProductosLibrosIndividuales() {
            let me = this;
            me.productos_Libros_Individuales = [];
            me.$http.get(me.$server_url + 'Todo_Libros_Individuales_pedido_alcance_formatoprecio')
                .then(res => {
                    // Object.freeze evita que Vue cree watchers sobre cada elemento
                    // (son datos de solo lectura para el select, nunca se modifican)
                    me.productos_Libros_Individuales = Object.freeze(res.data);
                })
                .catch(err => {
                    console.error('Error cargando libros individuales:', err);
                });
        },
        enfocarElemento(el) {
            if (!el) return;

            // Remover la clase de foco de cualquier otro elemento previo
            document.querySelectorAll('.libro-enfocado-actual').forEach(node => {
                node.classList.remove('libro-enfocado-actual');
            });

            // Añadir clase de foco visual intenso al elemento actual
            el.classList.add('libro-enfocado-actual');

            // PASO 1: Salto inmediato para forzar despertar las zonas sin ver animaciones rotas
            el.scrollIntoView({ behavior: 'auto', block: 'center' });

            // PASO 2: Pequeño tiempo para cargar el DOM, y hacemos el ajuste suave final
            // por si los tamaños de las cajas variaron al cargar el contenido de las tablas.
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
}
</script>

<style scoped>
.titleBook {
    cursor: pointer;
}

.removeMenu {
    display: none !important;
}
.libro-resaltado {
    border: 3px solid #28c76f !important;
    background-color: #e8f9ee;
    box-shadow: 0px 0px 10px rgba(40, 199, 111, 0.5);
    transform: scale(1.02);
    transition: all 0.3s ease;
}
.resaltado-area {
    background-color: #FFD700 !important;
    color: #333 !important;
    outline: 3px solid #FF8C00;
    box-shadow: 0px 0px 12px rgba(255, 165, 0, 0.7);
    transition: all 0.3s ease;
}
.libro-resaltado-individual {
    border: 3px solid #28a745 !important;
    background-color: #d4edda;
    box-shadow: 0px 0px 12px rgba(40, 167, 69, 0.6);
    transform: scale(1.03);
    transition: all 0.3s ease;
}
/* Estilo super-resaltado para el elemento enfocado actualmente al navegar */
.libro-enfocado-actual {
    border-color: #ff8c00 !important; /* Naranja advertencia */
    background-color: #fff3e0 !important;
    box-shadow: 0px 0px 18px rgba(255, 140, 0, 0.8) !important;
    transform: scale(1.05) !important;
    animation: pulse-focus 1.5s infinite;
    z-index: 10;
    position: relative;
}
@keyframes pulse-focus {
    0% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.7); }
    70% { box-shadow: 0 0 0 14px rgba(255, 140, 0, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0); }
}
</style>
