<template>
<div>
    <vs-row vs-type="flex" vs-justify="start" vs-align="start">
        <!-- Región -->
        <vs-col vs-lg="3" vs-md="6" vs-sm="12" vs-xs="12">
            <div style="margin: 10px;" align="center">
                <span>Seleccione la región</span>
                <ul class="mt-2">
                    <li class="mr-3">
                        <vs-radio v-model="tipoRegion" @change="obtenerPeriodos();" vs-name="radios1tipoFiltro" vs-value="1">Sierra</vs-radio>
                    </li>
                    <li class="mr-3">
                        <vs-radio v-model="tipoRegion" @change="obtenerPeriodos();" vs-name="radios1tipoFiltro" vs-value="2">Costa</vs-radio>
                    </li>
                </ul>
            </div>
        </vs-col>
        <!-- Período -->
        <vs-col vs-lg="4" vs-md="6" vs-sm="12" vs-xs="12">
            <div style="margin: 10px;">
                <span>Seleccione el período</span>
                <v-select :options="arrayPeriodos" :reduce="periodo => periodo.idperiodoescolar" placeholder="-Seleccione-" label="periodoescolar" class="w-full mt-2" v-model="periodoSelected" @input="FiltroGeneralReporte()" />
            </div>
        </vs-col>
        <!-- Serie -->
        <vs-col vs-lg="4" vs-md="6" vs-sm="12" vs-xs="12">
            <div style="margin: 10px;">
                <span>Seleccione la serie</span>
                <v-select :options="arraySerie" :reduce="serie => serie.id_serie" placeholder="-Seleccione-" label="nombre_serie" class="w-full mt-2" v-model="serieSelected" @input="FiltroGeneralReporte()" />
            </div>
        </vs-col>
    </vs-row>
    <!-- <vs-row vs-type="flex" vs-justify="start" vs-align="start">
        <vs-col vs-lg="12" vs-md="12" vs-sm="12" vs-xs="12" align="center">
            <vs-button color="primary" @click="FiltroGeneralReporte()" class="mt-6" type="filled">Buscar</vs-button>
        </vs-col>
    </vs-row> -->
    <br>
    <div v-if="arrayCodigos_General.length > 0">
        <vs-divider><b>Filtros para la búsqueda</b></vs-divider>
        <vs-row align="center">
            <vs-col vs-lg="12" vs-md="12" vs-sm="12" vs-xs="12">
                <table align="center">
                    <tr>
                        <td style="display: inline-flex; margin: 5px;">
                            <vs-radio v-model="filtro_texto_guia" @change="filtrarCodigos_Textos_Guias()" class="ml-2" vs-value="0">Textos y Guías</vs-radio>
                        </td>
                        <td style="display: inline-flex; margin: 5px;">
                            <vs-radio v-model="filtro_texto_guia" @change="filtrarCodigos_Textos_Guias()" class="ml-2" vs-value="1">Solo Textos</vs-radio>
                        </td>
                        <td style="display: inline-flex; margin: 5px;">
                            <vs-radio v-model="filtro_texto_guia" @change="filtrarCodigos_Textos_Guias()" class="ml-2" vs-value="2">Solo Guías</vs-radio>
                        </td>
                    </tr>
                </table>
            </vs-col>
        </vs-row>
        <vs-divider><b>Resultado del reporte</b></vs-divider>
        <div class="flex">
            <div class="w-1/2">
                <p class="text-center font-bold"> Total de códigos despachados: {{ totalLibros }} </p>
            </div>
            <div class="w-1/2">
                <p class="text-center font-bold"> Periodo: {{ arrayPeriodos.find(x => x.idperiodoescolar == periodoSelected).periodoescolar }} </p>
            </div>
        </div>
        <!-- Componente de historial de versiones -->
        <div class="mb-4">
            <HistorialVersionesReporte
                :nombre-reporte="`ReporteDespachados_${arrayPeriodos.find(x => x.idperiodoescolar == periodoSelected).periodoescolar}-Serie_${arraySerie.find(x => x.id_serie == serieSelected).nombre_serie}`"
                :periodo-id="periodoSelected"
                :serie-id="serieSelected"
                :datosActuales="obtenerDatosParaComparacion()"
                :totalActual="totalLibros"
            />
        </div>
        <TableReutilizableVue :title="''" :ifexportar="Number(1)" :nombrearchivo="'ReporteDespachados_'+arrayPeriodos.find(x => x.idperiodoescolar == periodoSelected).periodoescolar+'-Serie_'+arraySerie.find(x => x.id_serie == serieSelected).nombre_serie"
            :headers="['Código','Libro','Cantidad despachada','Stock General', 'Stock Facturas Prolipa', 'Stock Notas Prolipa', 'Stock Facturas Calmed', 'Stock Notas Calmed',]"
            :fieldKeys="['codigo_texto_o_guia','pro_nombre','cantidad_despachada','pro_reservar','pro_stock','pro_deposito','pro_stockCalmed','pro_depositoCalmed']" :tableData="arrayCodigos_filtrado"
            @reporte-exportado="handleReporteExportado"/>
    </div>
    <div v-else-if="(resultadolisto == true || resultadolisto == false) && (periodoSelected == '' || periodoSelected == null || serieSelected == '' || serieSelected == null)">
        <p class="text-center font-bold"> Complete todos los campos para obtener resultados. </p>
    </div>
    <div v-else-if="resultadolisto == true && arrayCodigos_General.length == 0">
        <p class="text-center font-bold"> No hay códigos para el período seleccionado </p>
    </div>
    <div v-else>
        <p class="text-center font-bold">Espere por favor... </p>
    </div>
</div>
</template>

<script>
import vSelect from 'vue-select'
import PeriodoRepository from '@/repositories/PeriodoRepository';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
import Generalmix from '../../../mixins/Generalmix';
import HistorialVersionesReporte from '@/views/codigos/reportes/HistorialVersionesReporte.vue';
export default {
    mixins: [Generalmix],
    components: {
        'v-select': vSelect,
        TableReutilizableVue,
        HistorialVersionesReporte,
    },
    data() {
        return {
            arrayPeriodos: [],
            periodoSelected: [],
            tipoRegion: '1',
            arrayReporte: [],
            arrayReporteGuias: [],
            arraySerie: [],
            arrayCodigos_General: [],
            serieSelected: '',
            totalLibros: 0,
            resultadolisto: false,
            filtro_texto_guia: 0,
            isrunLoading_metodoReporteGeneral: false,
            mixinIdInicioFormatoNewData: null,
            arrayCodigos_filtrado: [],
            usuario: [],

        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
      let me = this;
      // Verifica si los datos existen en localStorage
      const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
      if (mixinData) {
        // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
        const parsedData = JSON.parse(mixinData);
        me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
        console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
      } else {
          console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
      }
      // FIN Verificación si los datos existen en localStorage
      this.f_obtenerSeries();
      this.obtenerPeriodos();
    },
    methods: {
        f_obtenerSeries() {
            let me = this;
            var url = `series`
            this.$http.get(this.$server_url + url)
                .then(function (res) {
                    me.arraySerie = res.data;
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        obtenerPeriodos() {
          this.serieSelected = [];
          this.periodoSelected = [];
          this.arrayCodigos_General = [];
          this.arrayCodigos_filtrado = [];
            this.$vs.loading();
            PeriodoRepository.getPeriodos()
                .then(p => {
                    this.arrayPeriodos = p.data
                    this.filtrarPeriodos(p.data);
                    this.$vs.loading.close();
                })
                .catch(error => {
                    this.m_message("Error al cargar los períodos", "error");
                    console.error(error);
                    this.$vs.loading.close();
                });
        },
        filtrarPeriodos(datos) {
            this.arrayPeriodos = datos.filter(p => p.region_idregion == this.tipoRegion);
        },
        async FiltroGeneralReporte() {
            let me = this;
            this.arrayCodigos_General = [];
            this.arrayCodigos_filtrado = [];
            try {
                if (me.serieSelected == '' || me.serieSelected == null || me.serieSelected == undefined) {
                    me.m_message('Seleccione una serie', 'warning')
                    me.$vs.loading.close();
                    return;
                } else if (me.periodoSelected == '' || me.periodoSelected == null || me.periodoSelected == undefined) {
                    me.m_message('Seleccione un periodo', 'warning')
                    me.$vs.loading.close();
                    return;
                } else {
                    if (me.filtro_texto_guia == 0 || me.filtro_texto_guia == 1 || me.filtro_texto_guia == 2) {
                        me.$vs.loading();
                        // console.log(me.periodoSelected, me.serieSelected, "olaaa");
                        me.resultadolisto = false;
                        me.isrunLoading_metodoReporteGeneral = true;
                        await me.filtrarReporteTextos();
                        await me.filtrarReporteGuias();
                        await me.OrganizarCodigos();
                        if (me.arrayCodigos_General.length > 0) {
                         await me.filtrarCodigos_Textos_Guias();
                        }
                        me.isrunLoading_metodoReporteGeneral = false;
                        me.resultadolisto = true;
                    } else {
                        console.log("No se ha seleccionado un filtro válido.");
                    }
                }
            } catch (error) {
                console.error('Error en FiltroGeneralReporte:', error);
            } finally {
                me.$vs.loading.close();
            }
        },
        async filtrarReporteGuias() {
            let me = this;
            me.arrayReporteGuias = [];
            return new Promise((resolve, reject) => {
                // Usar siempre el método unificado que soporta ambos períodos automáticamente
                let url = `metodosGetCodigos?reporteBodega_newGuias_FormatoNuevo=1&periodo=${me.periodoSelected}&serie=${me.serieSelected}`;

                this.$http.get(this.$server_url + url)
                    .then(function (res) {
                        me.arrayReporteGuias = res.data;
                        resolve();
                        if (me.arrayReporteGuias.length == 0) {
                            me.$vs.notify({
                                text: 'No hay códigos de guias para el período seleccionado',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                            return false;
                        }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.notify({
                            text: 'Ocurrio un error al filtrar los reportes',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        reject(err);
                    })
            });
        },
        async filtrarReporteTextos() {
            let me = this;
            me.arrayReporte = [];
            me.totalLibros = 0;
            return new Promise((resolve, reject) => {
                var url = `metodosGetCodigos?reporteBodega_new=1&periodo=${me.periodoSelected}&serie=${me.serieSelected}`
                this.$http.get(this.$server_url + url)
                    .then(function (res) {
                        me.arrayReporte = res.data;
                        resolve();
                        // if (me.arrayReporte.length == 0) {
                        //     me.$vs.notify({
                        //         text: 'No hay códigos de textos para el período seleccionado',
                        //         color: 'warning',
                        //         iconPack: 'feather',
                        //         icon: 'icon-alert-triangle'
                        //     })
                        //     return false;
                        // }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.notify({
                            text: 'Ocurrio un error al filtrar los reportes',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        reject(err);
                    })
            });
        },
        async OrganizarCodigos(){
          let me = this;
          me.totalLibros = 0;
          me.arrayCodigos_General = [];
            const data_enviar = {
              reporteBodega_newGuias_OrganizarCodigos: 1,
              Guias_Array: me.arrayReporteGuias.resultado_final,
              Textos_Array: me.arrayReporte,
              periodo: me.periodoSelected,
              serie: me.serieSelected
            }
            return new Promise((resolve, reject) => {
                var url = `metodosPostCodigos`
                this.$http.post(this.$server_url + url, data_enviar)
                    .then(function (res) {
                        me.arrayCodigos_General = res.data.ResumenGeneral;
                        resolve();
                        // if (me.arrayCodigos_General.length == 0) {
                        //     me.$vs.notify({
                        //         text: 'No hay códigos para el período seleccionado',
                        //         color: 'warning',
                        //         iconPack: 'feather',
                        //         icon: 'icon-alert-triangle'
                        //     })
                        //     return false;
                        // }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.notify({
                            text: 'Ocurrio un error al filtrar los reportes',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        reject(err);
                    })
            });
        },
        async filtrarCodigos_Textos_Guias() {
          this.totalLibros = 0;
          return new Promise((resolve, reject) => {
            try {
                if (this.filtro_texto_guia == 0) {
                  // Mostrar todos
                  this.arrayCodigos_filtrado = this.arrayCodigos_General;
                  this.arrayCodigos_filtrado.forEach(p => {
                    this.totalLibros += Number(p.cantidad_despachada || 0);
                  });
                } else if (this.filtro_texto_guia == 1) {
                  // Solo textos (gru_pro_codigo == 1)
                  this.arrayCodigos_filtrado = this.arrayCodigos_General.filter(item => item.gru_pro_codigo == 1);
                  this.arrayCodigos_filtrado.forEach(p => {
                    this.totalLibros += Number(p.cantidad_despachada || 0);
                  });
                } else if (this.filtro_texto_guia == 2) {
                  // Solo guías (gru_pro_codigo == 2)
                  this.arrayCodigos_filtrado = this.arrayCodigos_General.filter(item => item.gru_pro_codigo == 2);
                  this.arrayCodigos_filtrado.forEach(p => {
                    this.totalLibros += Number(p.cantidad_despachada || 0);
                  });
                }
                resolve();
            } catch (error) {
              console.log(error);
              reject(error);
            }
          });
        },
        async handleReporteExportado({ nombre, data }) {
            try {
                // Combinar los datos originales que tienen los códigos
                let datosConCodigos = [];

                // Agregar textos (si existen)
                if (this.arrayReporte && this.arrayReporte.length > 0) {
                    datosConCodigos = datosConCodigos.concat(this.arrayReporte);
                }

                // Agregar guías (si existen)
                if (this.arrayReporteGuias && this.arrayReporteGuias.resultado_final && this.arrayReporteGuias.resultado_final.length > 0) {
                    datosConCodigos = datosConCodigos.concat(this.arrayReporteGuias.resultado_final);
                }



                // Enviar los datos originales que contienen los códigos
                const response = await this.$http.post(this.$server_url+'guardar-reporte-versionado', {
                    nombre,
                    data: datosConCodigos, // Enviar los datos originales con códigos
                    periodo_id: this.periodoSelected,
                    serie: this.serieSelected,
                    usuario: this.usuario.idusuario,
                    total: this.totalLibros
                });

                if (response.data.nueva_version) {
                    this.$vs.notify({
                        color: 'success',
                        title: 'Versión guardada',
                        text: 'Se creó una nueva versión del reporte.'
                    });
                } else {
                    this.$vs.notify({
                        color: 'warning',
                        title: 'Sin cambios',
                        text: 'El contenido del reporte es idéntico, no se creó nueva versión.'
                    });
                }
            } catch (error) {
                console.error(error);
                this.$vs.notify({
                    color: 'danger',
                    title: 'Error',
                    text: 'No se pudo guardar la versión del reporte.'
                });
            }
        },
        obtenerDatosParaComparacion() {
            // Combinar los datos originales que tienen los códigos individuales
            let datosConCodigos = [];

            // Agregar textos (si existen)
            if (this.arrayReporte && this.arrayReporte.length > 0) {
                datosConCodigos = datosConCodigos.concat(this.arrayReporte);
            }

            // Agregar guías (si existen)
            if (this.arrayReporteGuias && this.arrayReporteGuias.resultado_final && this.arrayReporteGuias.resultado_final.length > 0) {
                datosConCodigos = datosConCodigos.concat(this.arrayReporteGuias.resultado_final);
            }

            return datosConCodigos;
        }
    }
}
</script>
