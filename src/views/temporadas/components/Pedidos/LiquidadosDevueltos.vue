<template>
<div>
  <div v-if="menu == 0">
    <!--FILTROS-->
    <vs-card>
        <div class="title">
            Filtro de verificaciones Devueltas
        </div>
        <div class="mt-5">
            <ul style="display:flex;flex-wrap: wrap;">
                <li>
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0"><span class="font-bold">{{sumaTotal}}</span> Todos</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif1 > 0">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="1"><span style="font-weight:bold;">{{SumaVerif1}}</span> Verif 1</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif2 > 0">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="2"><span style="font-weight:bold;">{{SumaVerif2}}</span> Verif 2 </vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif3 > 0">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="3"><span style="font-weight:bold;">{{SumaVerif3}}</span> Verif 3 </vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif4 > 0">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="4"><span style="font-weight:bold;">{{SumaVerif4}}</span> Verif 4</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif5 > 0">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="5"><span style="font-weight:bold;">{{SumaVerif5}}</span> Verif 5</vs-radio>
                </li>
            </ul>
        </div>
    </vs-card>
    <vs-table max-items="10" search pagination :data="tmparregloCodigos">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ tmparregloCodigos.length }}</b></vs-chip>
            <vs-button @click="exportarExcel()" color="success" type="filled" icon-pack="feather" icon="icon-download" class="ml-2">
                Exportar Excel
            </vs-button>
        </template>
        <template slot="thead">
            <vs-th>Código</vs-th>
            <vs-th>Num verificación</vs-th>
            <vs-th>Fecha Devolución</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    <b>Código</b>
                    <p>{{data[indextr].codigo_libro}}<br></p>
                    <b>Contrato</b>
                    <p>{{data[indextr].devueltos_liquidados}}<br></p>
                    <div v-if="tr.combo.length > 0">
                      <b class="text-warning">Quitado como combo del reporte</b><br>
                      <ul>
                        <li v-for="(item, index) in tr.combo" :key="index">
                          <b>Combo del libro:</b>
                          <p>{{item.combo}}</p>
                          <b>Combo etiqueta:</b>
                          <p>{{item.codigo_combo}}</p>
                        </li>
                      </ul>
                    </div>
                </vs-td>
                <vs-td>
                    {{data[indextr].verificacion_liquidada}}<br>
                </vs-td>
                <vs-td>
                    {{data[indextr].created_at}}<br>
                    <b>Editor:</b>
                    <p>{{data[indextr].editor}}</p>
                </vs-td>
                <vs-td>
                    <vs-button @click="ObjectSelected=tr;f_confirmarRegresar(tr)" color="success">Reintegrar</vs-button>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
  </div>
  <div v-if="menu == 1" class="mt-5">
    <ConfirmEliminarVue otroValor="1" :title="'Estás seguro de regresar el codigo? '+ObjectSelected.codigo_libro" subtitle="Si, deseo regresar el codigo" @changeConfirm="changeConfirm"/>
  </div>
</div>
</template>

<script>
const ConfirmEliminarVue = () => import('../../../configuracion/Reutilizable/ConfirmEliminar.vue')
import { export_json_to_excel } from '@/vendor/Export2Excel'
export default {
  components: {
    ConfirmEliminarVue,
  },
    data() {
        return {
          usuario:[],
            tmparregloCodigos: [],
            arregloCodigosDevueltos: [],
            codigoTipo: 0,
            menu:0,
            ObjectSelected:'',
        }
    },
    props: {
        contrato: {
            type: String,
            default: ""
        },
        sendVerificacion: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    computed: {
        sumaTotal() {
            let me = this;
            let total = me.arregloCodigosDevueltos.length
            return total
        },
        SumaVerif1() {
            let me = this;
            let datos = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif1');
            let resultado = datos.length
            return resultado
        },
        SumaVerif2() {
            let me = this;
            let datos = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif2');
            let resultado = datos.length
            return resultado
        },
        SumaVerif3() {
            let me = this;
            let datos = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif3');
            let resultado = datos.length
            return resultado
        },
        SumaVerif4() {
            let me = this;
            let datos = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif4');
            let resultado = datos.length
            return resultado
        },
        SumaVerif5() {
            let me = this;
            let datos = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif5');
            let resultado = datos.length
            return resultado
        },
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getCodigosDevueltosLiquidados()
    },
    methods: {
      changeConfirm(e){
          let me = this;
          //cancelar
          if(e == 0) { me.menu = 0  }
          //asignar
          if(e == 1) { me.f_restaurar_liquidado_devuelto(); }
      },
      getCodigosDevueltosLiquidados() {
        let me = this;
        me.$vs.loading();
        me.arregloCodigosDevueltos = [];
        me.tmparregloCodigos = [];
        this.$http.get(this.$server_url + 'getliquidadosDevueltos/' + me.contrato)
          .then(function (res) {
            // Primero parseamos el campo combo si existe, si no, dejamos como []
            me.arregloCodigosDevueltos = res.data.map(item => {
              let comboParsed = [];
              try {
                if (item.combo) {
                  comboParsed = JSON.parse(item.combo);
                }
              } catch (e) {
                console.error('Error al parsear combo:', e);
              }

              return {
                ...item,
                combo: comboParsed
              };
            });

            if (me.arregloCodigosDevueltos.length === 0) {
              me.$vs.notify({
                text: 'No hay códigos devueltos liquidados',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              });
              me.$vs.loading.close();
              return;
            }

            me.filtroTipo();
            me.$vs.loading.close();
          })
          .catch(function (error) {
            me.$vs.loading.close();
            console.log(error + ' error');
          });
      },
      filtroTipo() {
          let me = this;
          me.tmparregloCodigos = []
          let datos = me.arregloCodigosDevueltos
          //TODOS
          if (me.codigoTipo == 0) {
              let primerFiltro = datos
              me.tmparregloCodigos = primerFiltro
              return
          } else {
              let primerFiltro = datos.filter(p => p.verificacion_liquidada == `verif${me.codigoTipo}`)
              me.tmparregloCodigos = primerFiltro
          }
      },
      f_confirmarRegresar(){
        let me = this;
        me.menu = 1
      },
      f_restaurar_liquidado_devuelto() {
        this.$vs.loading();
        let formData = new FormData()
        formData.append('id_usuario', this.usuario.idusuario)
        formData.append('codigo', this.ObjectSelected.codigo_libro)
        formData.append('contrato', this.ObjectSelected.devueltos_liquidados)
        this.$http.post(this.$server_url + `restaurarALiquidado_devueltos`, formData)
          .then((res) => {
              this.$vs.loading.close();
              if(res.data.status == '0'){
                  this.$vs.notify({
                      type: 'error',
                      title: 'Error',
                      color: 'danger',
                      text: res.data.message
                  });
                  return
              }
              this.$vs.notify({
                  type: 'success',
                  title: 'Exito',
                  text: 'El código ha sido restaurado'
              });
              this.getCodigosDevueltosLiquidados();
              this.menu = 0
              let objeto = {
                tipo: 8,
              }
              this.$emit('recharge',objeto)
          })
          .catch((error) => {
            this.$vs.notify({
                type: 'error',
                title: 'Error',
                color: 'danger',
                text: 'Hubo un problema al restaurar el código'
            });
          })
          .finally(() => {
              this.$vs.loading.close();
          });
      },
      exportarExcel() {
        let me = this;
        if (me.tmparregloCodigos.length === 0) {
          me.$vs.notify({
            text: 'No hay datos para exportar',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          });
          return;
        }

        // Preparar los datos para el Excel
        const header = ['Código', 'Contrato', 'Verificación', 'Fecha Devolución', 'Editor', 'Combo','Combo etiqueta'];

        const data = me.tmparregloCodigos.map(item => {
          let combosTexto = '';
          let codigosComboTexto = '';

          if (item.combo && item.combo.length > 0) {
            combosTexto = item.combo.map(combo => combo.combo).join('; ');
            codigosComboTexto = item.combo.map(combo => combo.codigo_combo).join('; ');
          }

          return [
            item.codigo_libro || '',
            item.devueltos_liquidados || '',
            item.verificacion_liquidada || '',
            item.created_at || '',
            item.editor || '',
            combosTexto,
            codigosComboTexto
          ];
        });

        const filename = `Liquidados_Devueltos_${this.contrato}_${new Date().toISOString().slice(0, 10)}`;

        export_json_to_excel({
          header,
          data,
          filename,
          autoWidth: true,
          bookType: 'xlsx'
        });

        me.$vs.notify({
          type: 'success',
          title: 'Exportación Exitosa',
          text: 'El archivo Excel se ha descargado correctamente'
        });
      }
    }
}
</script>
