<template>
    <div v-if="loading">
        <ul class="mt-5">
            <li v-if="ValidatefaltanLibrosCombo"><i class="fa-solid fa-circle-exclamation text-danger"></i> Existe combos que faltan libros</li>
            <li v-if="ValidateDemasLibrosCombo"><i class="fa-solid fa-circle-exclamation text-danger"></i> Existe combos que tienen demasiados libros</li>
            <li v-if="ValidateCodigosCombosNoCoincide"><i class="fa-solid fa-circle-exclamation text-danger"></i> Existe combos que no coinciden</li>
            <li v-if="ValidateCodigosCombosDuplicados"><i class="fa-solid fa-circle-exclamation text-danger"></i> Existe combos que tiene varios códigos del mismo libro</li>
            <li v-if="ValidateCodigosComboNoExiste"><i class="fa-solid fa-circle-exclamation text-danger"></i> Existe combos sin códigos</li>
            <li v-if="ValidateCombosSinPrecio"><i class="fa-solid fa-circle-exclamation text-danger"></i> Existe combos sin precio</li>
        </ul>
        <div class="mt-3 mb-3 d-flex align-items-center">
            <vs-checkbox v-if="hayErrores" v-model="mostrarSoloErrores">Mostrar solo combos con errores</vs-checkbox>
            <vs-button v-if="combosParaMostrar.length > 0" color="success" icon-pack="feather" icon="icon-download" @click="exportarExcel()" type="line" class="ml-3">Exportar a Excel</vs-button>
        </div>
        <vs-table max-items="4" search pagination :data="combosParaMostrar">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ combosParaMostrar.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Combo generado</vs-th>
                <vs-th>Combo del libro</vs-th>
                <vs-th>Cantidad de códigos</vs-th>
                <vs-th>Cantidad devuelta</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].paquete}}<br>
                    </vs-td>
                    <vs-td>
                        <div v-if="data[indextr].comboLibro">
                            {{ data[indextr].comboLibro }}
                            <div>
                                <p style="font-size: 11px;font-weight: 500;">{{ tr.infoCombo && tr.infoCombo.codigos_combos ? '( '+ tr.infoCombo.codigos_combos + ' )' : 'Sin libros' }}</p>
                            </div>
                        </div>
                        <div v-else>
                            No existe el combo del libro
                        </div>
                    </vs-td>
                    <vs-td>
                        {{ tr.cantidadCodigos }}
                        <div v-if="tr.contadorLibrosCombo > 0">
                            <div v-if="tr.cantidadCodigos < tr.contadorLibrosCombo">
                                <p class="text-danger">Falta <b>{{ tr.contadorLibrosCombo - tr.cantidadCodigos }}</b> libros en el combo</p>
                            </div>
                            <div v-if="tr.cantidadCodigos > tr.contadorLibrosCombo">
                                <p class="text-danger">Hay <b>{{ tr.cantidadCodigos - tr.contadorLibrosCombo }}</b> libros demas en el combo</p>
                            </div>
                        </div>

                        <!--No coincide-->
                        <div v-if="tr.noCoincide > 0">
                            <p class="text-danger">No coincide <b>{{ tr.noCoincide }}</b> libros en el combo</p>
                        </div>
                        <!--Tiene codigos repetidos-->
                        <div v-if="tr.tieneCodigosRepetidos > 0">
                            <p class="text-danger">Tiene <b>{{ tr.tieneCodigosRepetidos }}</b> codigos repetidos en el combo</p>
                        </div>
                        <!--noCoincideCodigoLiquidacion-->
                        <div v-if="tr.noCoincideCodigoLiquidacion.length > 0">
                            <div v-for="(ncl, indexncl) in tr.noCoincideCodigoLiquidacion" :key="indexncl">
                                <p class="text-danger">Falta el libro: <b>{{ ncl }}</b></p>
                            </div>
                        </div>
                        <!-- codigosQueNoPertenecenAlCombo -->
                        <div v-if="tr.codigosQueNoPertenecenAlCombo.length > 0">
                            <div v-for="(ncl, indexncl) in tr.codigosQueNoPertenecenAlCombo" :key="indexncl">
                                <p class="text-danger">El libro: <b>{{ ncl }}</b> no pertenece al combo</p>
                            </div>
                        </div>
                        <!-- noExisteCodigos -->
                        <div v-if="tr.noExisteCodigos > 0">
                            <p class="text-danger">No existe códigos en el combo</p>
                        </div>
                        <!-- noExisteComboPrecio -->
                        <!-- <div v-if="tr.noExisteComboPrecio > 0">
                            <p class="text-danger">Hay codigos sin el combo del libro</p>
                        </div> -->
                        <!--codigosSinComboPrecio-->
                        <div v-if="tr.codigosSinComboPrecio.length > 0" class="mt-2">
                            <div v-for="(ncl, indexncl) in tr.codigosSinComboPrecio" :key="indexncl">
                                <p class="text-danger">El código: <b>{{ ncl }}</b> no tiene el combo del libro</p>
                            </div>
                        </div>
                    </vs-td>
                    <vs-td>{{ tr.devueltos }}</vs-td>
                    <vs-td>
                        <!--mostrar los codigos-->
                        <vs-button color="#af7ac5" class="mb-2" @click="ObjectSelected = data[indextr];f_mostrarCodigos(tr)" >Mostrar códigos</vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup classContent="popup-example" title="Mostrar códigos" :active.sync="popupMostrarCodigos">
            <div v-if="popupMostrarCodigos">
                <TableReutilizableVue
                :title="'Códigos del Combo'+': ' + ObjectSelected.paquete"
                :headers="['Código','Codigo de liquidacion','Estado','Documento Devolución']"
                :fieldKeys="['codigo','codigo_liquidacion','devuelto','documento_devolucion']"
                :tableData="arrayCodigos"
                />
            </div>
        </vs-popup>
    </div>
</template>
<script>
import Generalmix from '../../../../../mixins/Generalmix'
import LibroRepository from '@/repositories/LibroRepository'
const TableReutilizableVue        = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
    mixins: [Generalmix],
    components:{
        TableReutilizableVue
    },
    data(){
        return{
            popupMostrarCodigos:false,
            arrayCodigos:[],
            arrayCombos:[],
            ObjectSelected:{},
            ValidatefaltanLibrosCombo:false,
            ValidateDemasLibrosCombo:false,
            ValidateCodigosCombosNoCoincide:false,
            ValidateCodigosCombosDuplicados:false,
            ValidateCodigosComboNoExiste:false,
            ValidateCombosSinPrecio:false,
            loading:false,
            mostrarSoloErrores:false,
        }
    },
    props:{
        arrayComparativoPaquetes:{
            type:Array,
            required:true
        },
    },
    async mounted() {
        await this.f_iniciar();
    },
    computed:{
        hayErrores(){
            return this.ValidatefaltanLibrosCombo ||
                   this.ValidateDemasLibrosCombo ||
                   this.ValidateCodigosCombosNoCoincide ||
                   this.ValidateCodigosCombosDuplicados ||
                   this.ValidateCodigosComboNoExiste ||
                   this.ValidateCombosSinPrecio;
        },
        combosParaMostrar(){
            if(!this.mostrarSoloErrores){
                return this.arrayComparativoPaquetes;
            }
            // Filtrar solo los combos que tienen algún error
            return this.arrayComparativoPaquetes.filter(combo => {
                return combo.noExisteCodigos > 0 ||
                       (combo.contadorLibrosCombo > 0 && combo.cantidadCodigos < combo.contadorLibrosCombo) ||
                       (combo.contadorLibrosCombo > 0 && combo.cantidadCodigos > combo.contadorLibrosCombo) ||
                       combo.noCoincide > 0 ||
                       combo.tieneCodigosRepetidos > 0 ||
                       combo.noExisteComboPrecio > 0 ||
                       combo.noCoincideCodigoLiquidacion.length > 0 ||
                       combo.codigosQueNoPertenecenAlCombo.length > 0 ||
                       combo.codigosSinComboPrecio.length > 0;
            });
        }
    },
    methods:{
        async f_iniciar() {
            let me = this;
            this.loading = false
            try {
                await this.getCombos();
                this.f_formatoCombos();
                this.f_sendEnviarValidacion();
            } catch (error) {
                console.error('Error al iniciar:', error);
            } finally {
               this.loading = true
            }
        },
        async getCombos() {
            try {
                const r = await LibroRepository.getAllCombos();
                this.arrayCombos = r.data;
            } catch (error) {
                console.error('Error al obtener combos:', error);
            }
        },
        f_formatoCombos() {
            let me = this;
            this.ValidatefaltanLibrosCombo = false;
            this.ValidateDemasLibrosCombo = false;
            this.ValidateCodigosCombosNoCoincide = false;
            this.ValidateCodigosCombosDuplicados = false;
            this.ValidateCodigosComboNoExiste = false;
            this.ValidateCombosSinPrecio = false;

            this.arrayComparativoPaquetes.forEach(p => {
                // Inicializar propiedades
                p.noExisteCodigos = 0;
                p.infoCombo = {};
                p.librosDelCombo = [];
                p.contadorLibrosCombo = 0;
                p.noCoincide = 0;
                p.noCoincideCodigoLiquidacion = [];
                p.codigosQueNoPertenecenAlCombo = [];
                p.codigosRepetidos = [];
                p.tieneCodigosRepetidos = 0;
                p.noExisteComboPrecio = 0;
                p.codigosSinComboPrecio = [];

                // obtener los codigos del combo
                const getCodigos = p.codigos;

                // Validar que exista códigos en el combo
                if(getCodigos.length == 0){
                    p.noExisteCodigos = 1;
                }else{
                    // obtener el combo precio
                    const getCombosLibros = getCodigos.map(c => c.combo);
                    if (getCombosLibros.some(combo => combo == null)) {
                        p.noExisteComboPrecio = 1;
                    }

                    // validar si hay codigos sin combo precio
                    const codigosSinComboPrecio = getCodigos
                        .filter(c => c.combo == null)
                        .map(c => c.codigo); // extrae el código de los que tienen combo null
                    p.codigosSinComboPrecio = codigosSinComboPrecio;
                    console.log("codigosSinComboPrecio",p.codigosSinComboPrecio)

                    // Valido que no exista combos sin precio
                    if (p.codigosSinComboPrecio.length == 0) {
                        // Obtener comboLibro del primer código si existe
                        p.comboLibro = getCodigos.length > 0 ? getCodigos[0].combo : '';
                        const datosCombo = this.arrayCombos.find(x => x.codigo_liquidacion === p.comboLibro);
                        if (datosCombo) {
                            p.infoCombo = datosCombo;

                            if (typeof datosCombo.codigos_combos === 'string') {
                                p.librosDelCombo = datosCombo.codigos_combos
                                    .split(',')
                                    .map(c => c.trim())
                                    .filter(c => c);
                            }
                        }

                        // Contar libros esperados en el combo
                        p.contadorLibrosCombo = p.librosDelCombo.length;

                        // Extraer códigos actuales
                        const codigosActuales = p.codigos.map(c => c.codigo_liquidacion);

                        // Libros esperados que NO están presentes
                        p.noCoincideCodigoLiquidacion = p.librosDelCombo.filter(libro => !codigosActuales.includes(libro));
                        p.codigosQueNoPertenecenAlCombo = codigosActuales.filter(cod => !p.librosDelCombo.includes(cod));

                        // Verificar si hay duplicados
                        const contadorCodigos = {};
                        codigosActuales.forEach(cod => {
                            contadorCodigos[cod] = (contadorCodigos[cod] || 0) + 1;
                        });
                        p.codigosRepetidos = Object.entries(contadorCodigos)
                            .filter(([_, count]) => count > 1)
                            .map(([codigo]) => codigo);
                        p.tieneCodigosRepetidos = p.codigosRepetidos.length > 0 ? 1 : 0;

                        // Marcar como noCoincide si hay faltantes o duplicados
                        p.noCoincide = (p.noCoincideCodigoLiquidacion.length > 0 || p.tieneCodigosRepetidos === 1) ? 1 : 0;
                    }
                }


            });// end foreach

            // Validación global si hay paquetes con menos libros de los esperados
            if (this.arrayComparativoPaquetes.some(y => y.contadorLibrosCombo > 0 && y.cantidadCodigos < y.contadorLibrosCombo)) {
                this.ValidatefaltanLibrosCombo = true;
            }

            // Validación global si hay paquetes con más libros de los esperados
            if (this.arrayComparativoPaquetes.some(y => y.contadorLibrosCombo > 0 && y.cantidadCodigos > y.contadorLibrosCombo)) {
                this.ValidateDemasLibrosCombo = true;
            }

            // Validación global si los códigos de los combos no coinciden
            if (this.arrayComparativoPaquetes.some(y => y.noCoincide > 0 )) {
                this.ValidateCodigosCombosNoCoincide = true;
            }

            // Validacion global si hay codigos de los combos duplicados
            if (this.arrayComparativoPaquetes.some(y => y.tieneCodigosRepetidos > 0)) {
                this.ValidateCodigosCombosDuplicados = true;
            }

            // Validacion global si no existe codigos en el combo
            if(this.arrayComparativoPaquetes.some(y => y.noExisteCodigos > 0)){
                this.ValidateCodigosComboNoExiste = true;
            }

            // Validacion global si no existe combos sin precio
            if(this.arrayComparativoPaquetes.some(y => y.noExisteComboPrecio > 0)){
                this.ValidateCombosSinPrecio = true;
            }
        },

        async f_sendEnviarValidacion() {
            let sendDatos = {
                ValidatefaltanLibrosCombo: this.ValidatefaltanLibrosCombo,
                ValidateDemasLibrosCombo: this.ValidateDemasLibrosCombo,
                ValidateCodigosCombosNoCoincide: this.ValidateCodigosCombosNoCoincide,
                ValidateCodigosCombosDuplicados: this.ValidateCodigosCombosDuplicados,
                ValidateCodigosComboNoExiste: this.ValidateCodigosComboNoExiste,
                ValidateCombosSinPrecio: this.ValidateCombosSinPrecio,
            };
            this.$emit('sendDatosValidationCombos', sendDatos);
        },
        f_mostrarCodigos(tr){
            this.arrayCodigos           = tr.codigos
            this.popupMostrarCodigos    = true
            //del arrayCodigos si tiene el estado_liquidacion = 3 colocar propiedad devuelto='devuelto'
            this.arrayCodigos.forEach(codigo => {
                if(codigo.estado_liquidacion == 3){
                    codigo.devuelto = 'devuelto'
                }else{
                    codigo.devuelto = 'Sin devolver'
                }
            })
        },
        exportarExcel() {
            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = [
                    'Combo generado',
                    'Combo del libro',
                    'Libros del combo',
                    'Cantidad de códigos',
                    'Cantidad devuelta',
                    'Errores encontrados'
                ];

                const data = this.combosParaMostrar.map(combo => {
                    let errores = [];

                    if(combo.noExisteCodigos > 0) {
                        errores.push('No existe códigos en el combo');
                    }
                    if(combo.contadorLibrosCombo > 0 && combo.cantidadCodigos < combo.contadorLibrosCombo) {
                        errores.push(`Falta ${combo.contadorLibrosCombo - combo.cantidadCodigos} libros en el combo`);
                    }
                    if(combo.contadorLibrosCombo > 0 && combo.cantidadCodigos > combo.contadorLibrosCombo) {
                        errores.push(`Hay ${combo.cantidadCodigos - combo.contadorLibrosCombo} libros demas en el combo`);
                    }
                    if(combo.tieneCodigosRepetidos > 0) {
                        errores.push(`Tiene ${combo.tieneCodigosRepetidos} codigos repetidos`);
                    }
                    if(combo.noCoincideCodigoLiquidacion.length > 0) {
                        errores.push(`Faltan libros: ${combo.noCoincideCodigoLiquidacion.join(', ')}`);
                    }
                    if(combo.codigosQueNoPertenecenAlCombo.length > 0) {
                        errores.push(`Códigos que no pertenecen: ${combo.codigosQueNoPertenecenAlCombo.join(', ')}`);
                    }
                    if(combo.codigosSinComboPrecio.length > 0) {
                        errores.push(`Códigos sin combo del libro: ${combo.codigosSinComboPrecio.join(', ')}`);
                    }

                    return [
                        combo.paquete || '',
                        combo.comboLibro || 'No existe',
                        combo.infoCombo && combo.infoCombo.codigos_combos ? combo.infoCombo.codigos_combos : 'Sin libros',
                        combo.cantidadCodigos || 0,
                        combo.devueltos || 0,
                        errores.length > 0 ? errores.join(' | ') : 'Sin errores'
                    ];
                });

                const fecha = new Date().toISOString().slice(0, 10);
                const tipoExport = this.mostrarSoloErrores ? 'ConErrores' : 'Todos';

                excel.export_json_to_excel({
                    header: tHeader,
                    data: data,
                    filename: `CombosDevueltos_${tipoExport}_${fecha}`,
                    autoWidth: true,
                    bookType: 'xlsx'
                });

                this.$vs.notify({
                    title: 'Excel Generado',
                    text: 'El archivo Excel se ha descargado exitosamente',
                    color: 'success',
                    position: 'top-right'
                });
            });
        }
    },
}
</script>
