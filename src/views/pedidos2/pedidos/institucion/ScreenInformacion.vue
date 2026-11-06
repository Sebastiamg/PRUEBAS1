<template>
    <div>
      <vx-card v-if="setMenu==0">
        <div class="vx-row" v-if="inputs.length">
          <vs-table :max-items="perPage" pagination :per-page="perPage" search stripe :data="inputs">
              <template slot="header">
                  <v-select v-model="perPage" :options="items" :reduce="(items) => items" label="val" class="small" place-holder="--sel--"/>
                  <vs-chip color="primary">Cantidad: <b>{{ inputs.length }} </b></vs-chip>

              </template>

              <template slot="thead">
                  <vs-th width="200"> # Item </vs-th>
                  <vs-th width="300"> Código</vs-th>
                  <vs-th width="500"> Descripción</vs-th>
                  <vs-th width="200"> Cantidad solicitada</vs-th>
                  <vs-th width="200"> Valor</vs-th>
              </template>
              <template slot-scope="{ data }">
                  <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                      <vs-td><br /><b>{{ indextr + 1 }}</b></vs-td>
                      <vs-td> {{ tr.codigo_liquidacion }} <br /> </vs-td>
                      <vs-td> Serie {{ tr.serieArea}} {{tr.anio}}<br /> </vs-td>
                      <vs-td> {{ tr.valor}} <br /> </vs-td>
                      <vs-td> ${{ (tr.precio).toFixed(2)}} <br /> </vs-td>
                  </vs-tr>
              </template>
          </vs-table>
        </div>
      </vx-card>
      <vx-card v-if="setMenu==1">
        <div class="flex">
          <vs-button @click="ExportToExcel('xlsx')" color="primary" class="btn btn-sm" icon-pack="feather" icon="icon-printer" v-if="arrayReporte.length > 0">
              Exportar
          </vs-button>
          <span class="ml-3 mt-3 font-bold">{{setPuntos.nombreDespacho}}</span>
        </div>
        <vs-table max-items="50" search stripe :data="arrayReporte" id="miTabla" v-if="arrayReporte.length > 0">
          <template slot="header">
              <vs-chip>Cantidad {{arrayReporte.length}}</vs-chip>
          </template>
          <template slot="thead">
              <vs-th class="fixed-column" sort-key="fecha_inicio">Institución</vs-th>
              <!-- <vs-th class="" sort-key="fecha_inicio">Ciudad</vs-th>-->
              <vs-th class="" sort-key="fecha_inicio">Contratos</vs-th>
              <vs-th class="" v-for="(value, key) in arrayReporte[0]" :key="key" v-if="key !== 'id_pedido' && key !== 'contrato_generado' && key !== 'nombreInstitucion' && key !== 'ciudad'">
                  {{ key.toUpperCase().replace('_', ' ') }}
              </vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td class="fixed-column">
                      <div>
                          <div style="width: 200px;" class="flex flex-col gap-2">
                              <span class="flex font-bold">{{ tr.nombreInstitucion }}</span>
                          </div>
                          <div>
                              <span class="text-xs text-danger">{{ tr.ciudad }}</span>
                          </div>
                          <!--boton para quitar del agrupado-->
                          <vs-button class="p-2" color="#B6AD38" @click="ObjecteSelected = tr;confirmRemoveAgrupado(tr)" ><i class="fa-solid fa-filter-circle-xmark"></i> Remover del agrupado</vs-button>
                      </div>
                  </vs-td>
                  <vs-td>
                      <div style="width: 200px;" class="flex flex-col gap-2">
                          <span class="flex font-bold">{{ tr.contrato_generado }}</span>
                      </div>
                  </vs-td>

                  <vs-td v-for="(value, key) in tr" :key="key" v-if="key !== 'id_pedido' && key !== 'contrato_generado' &&  key !== 'nombreInstitucion' && key !== 'ciudad'">
                      <span v-if="value > 0" style="background-color: #3FACB1;color:white;border-radius: 50%;padding: 10px;">
                          {{ value }}
                      </span>
                      <span v-else>
                      </span>
                  </vs-td>
              </vs-tr>
              <!-- Aquí agregamos la fila para el total -->
              <vs-tr>
                  <td class="fixed-column"><b>TOTAL LIBROS</b></td>
                  <td></td>
                  <td v-for="(value, key) in arrayTotales" :key="key">{{ value.cantidad }}</td>
              </vs-tr>
              <vs-tr>
                  <td class="fixed-column"><b>VALOR TOTAL </b></td>
                  <td></td>
                  <td v-for="(value, key) in arrayTotales" :key="key">{{ value.total | filtrarDecimal  }}</td>
              </vs-tr>
          </template>
        </vs-table>
        <br><br><br><br><br><br><br><br><br><br><br><br><br>
      </vx-card>
    </div>
    </template>

    <script>
    import vSelect from 'vue-select';
    import * as XLSX from 'xlsx';
    import {
        mapState
    } from 'vuex';
    export default {
      components: {
          vSelect
      },
      data() {
        return {
          setPuntos: [],
          sendPedido: '',
          arrayReporte: [],
          arrayLibros: [],
          arrayTotales: [],
          despachoSelect: '',
          setMenu:'',
          inputs:[],
          items:[10,20,25,50,100],
          perPage:10,
          ObjecteSelected:'',
          mixinIdInicioFormatoNewData: null,
        }
      },
      computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'ObjectPuntos', 'userAsesor', 'cerrarFactura']),
      },
      watch: {
        ObjectPuntos(results) {
          let me = this
          me.sendPuntos = me.ObjectPuntos
        },
        ObjectPedido(results) {
          let me = this
          me.sendPedido = me.ObjectPedido
        },
      },
      mounted() {
        let me =this
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
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if(me.usuario.id_group == 33){
          this.setMenu = 3
        }else{
          this.setMenu = 1
        }
        if (this.setMenu == 0) {
          this.sendPedido = this.ObjectPedido;
          setTimeout(function () {
            me.getinfopedido()
          }, 1000);
        }
        //Ingreso de puntos de venta o agrupado
        if (this.setMenu == 1) {
          this.setPuntos = this.ObjectPuntos;
          setTimeout(function () {
             me.getLibros()
          }, 1000);
        }
      },
      methods: {
        confirmRemoveAgrupado(){
          let me = this
            this.$vs.dialog({
              type:'confirm',
              color: 'danger',
              title: `Confirm`,
              text: 'Estas seguro de remover este contrato del agrupado',
              accept:this.removerAgrupado
            })
        },
        removerAgrupado(){
          let me = this
          let formData = new FormData();
            formData.append('ca_codigo_agrupado', me.setPuntos.ca_codigo_agrupado);
            formData.append('id_pedido',          me.ObjecteSelected.id_pedido);
            formData.append('usuario',                me.usuario.idusuario);
            me.$vs.loading()
            this.$http.post(this.$server_url+'removerContratoAgrupacion', formData)
            .then(res => {
            me.$vs.loading.close()
            if(res.data.status == 0){
              me.$vs.notify({
                text:res.data.message,
                color:'danger',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.$vs.notify({
                text:'Se removio correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            me.getLibros();
        },
        getLibros() {
          const me = this;
          me.arrayLibros = [];
          let nuevarutaxperiodo = '';
          if (this.setPuntos == null || this.setPuntos == undefined) {
            return;
          }
          let datosEnviar = []
          me.setPuntos.pedidos.forEach(pedido => {
            datosEnviar.push(pedido.id_pedido)
          });
          if(me.setPuntos.id_periodo <= me.mixinIdInicioFormatoNewData){
            nuevarutaxperiodo = `pedidos2/pedidos?getLibrosXDespacho=yes&id_pedidos=${datosEnviar.join(",")}&id_periodo=`;
          }else if(me.setPuntos.id_periodo > me.mixinIdInicioFormatoNewData){
            nuevarutaxperiodo = `pedidos2/pedidos?getLibrosXDespacho_new=yes&id_pedidos=${datosEnviar.join(",")}&id_periodo=`;
          }
          me.$vs.loading()
          this.$http.get(this.$server_url + nuevarutaxperiodo + this.setPuntos.id_periodo)
            .then((res) => {
              let datos = res.data;
              me.$vs.loading.close()
              if (datos.length == 0) {
                me.$vs.loading.close();
                me.$vs.notify({
                  text: 'Por favor, revisa los pedidos, ya que algunos podrían no tener contratos asociados o no haber solicitado ítems.',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-alert-circle'
                });
                return
              }
              let librosNormales        = []
              let libroPlanLector       = []
              let getNormalesOrdenado   = []
              let getPlanLectorOrdenado = []
              if (datos.length == 0) {
                me.showError("No hay libros para este asesor");
                return;
              }
              librosNormales          = datos.filter(p => p.id_serie != 6)
              libroPlanLector         = datos.filter(p => p.id_serie == 6)
              getNormalesOrdenado     = me.ordenarLibros(librosNormales)
              getPlanLectorOrdenado   = me.ordenarLibros(libroPlanLector)
              //unir array con spread operator
              me.arrayLibros = [...getNormalesOrdenado, ...getPlanLectorOrdenado]
              me.getReporte();
            })
            .catch((err) => {
                me.$vs.loading.close()
                this.showError("Error al obtener los libros", err);
            });
        },
        getReporte() {
          let me = this;
          me.arrayReporte = []
          me.arrayTotales = []
          me.$vs.loading();
          //api post
          let formData = new FormData();
          // Condición para asignar el valor correcto a 'getValoresLibrosContratosDespacho'
          if (me.setPuntos.id_periodo <= me.mixinIdInicioFormatoNewData) {
              formData.append('getValoresLibrosContratosDespacho', '1');
          } else if (me.setPuntos.id_periodo > me.mixinIdInicioFormatoNewData) {
              formData.append('getValoresLibrosContratosDespacho_new', '1');
          }
          formData.append('id_despacho',                        me.setPuntos.ca_codigo_agrupado);
          formData.append('arrayLibros',                        JSON.stringify(me.arrayLibros));
          formData.append('id_periodo',                         me.setPuntos.id_periodo);
          this.$http.post(this.$server_url + `pedidos2/pedidos`, formData)
            .then((res) => {
              me.$vs.loading.close();
              let datos = res.data
              datos.forEach(element => {
                var cal = new Object();
                cal.id_pedido = element.id_pedido
                cal.contrato_generado = element.contrato_generado
                cal.nombreInstitucion = element.nombreInstitucion
                cal.ciudad = element.ciudad
                for (let index = 0; index < element.librosFormato.length; index++) {
                  cal[element.librosFormato[index].codigo] = element.librosFormato[index].valor
                }
                //save libros
                me.arrayReporte.push(cal)
              });
              let count = me.arrayReporte.filter(el => el.contrato_generado !== 0 && el.contrato_generado !== null && el.contrato_generado !== undefined).length;
              if (count == 0) {
                  me.$vs.notify({
                      text: 'La proforma requiere al menos un contrato para continuar....',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-alert-circle'
                  });
              }
              me.getTotales();
              me.$emit("changeSend", count);
            }).catch((err) => {
              this.showError("Error al obtener el reporte");
              me.$vs.loading.close();
            });
        },
        getTotales() {
            let me = this
            me.arrayLibros.forEach(element => {
                let suma = 0
                let pretotal = 0
                let propName = element.codigo;
                suma = me.arrayReporte.reduce((total, obj) => total + (obj[propName] || 0), 0);
                pretotal = suma * element.precio
                //llenar
                var cal = new Object();
                cal.codigo = element.codigo
                cal.precio = element.precio
                cal.precio = element.precio
                cal.cantidad = suma
                cal.total = pretotal
                me.arrayTotales.push(cal)
            })
            me.$emit("changeSend", me.arrayReporte)
        },
        ordenarLibros(datos) {
            let me = this
            let predatos = []
            let valores = []
            predatos = datos
            valores = predatos.sort(function (a, b) {
                var nombreA = a.codigo.toLowerCase();
                var nombreB = b.codigo.toLowerCase();
                var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
                var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
                nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
                nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final
                if (nombreA < nombreB) {
                    return -1;
                }
                if (nombreA > nombreB) {
                    return 1;
                }
                if (numA && !numB) { // si a tiene número y b no, b va primero
                    return 1;
                }
                if (!numA && numB) { // si b tiene número y a no, a va primero
                    return -1;
                }
                if (numA && numB) { // si ambos tienen número, compararlos
                    if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                        return -1;
                    }
                    if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                        return 1;
                    }
                    return numA - numB; // comparar los números directamente
                }
                return 0; // si son iguales en todo, no hay diferencia
            });
            return valores
        },
        ExportToExcel(type, fn, dl) {
            var elt = document.getElementById('miTabla');
            var wb = XLSX.utils.table_to_book(elt, {
                sheet: "sheet1"
            });
            return dl ?
                XLSX.write(wb, {
                    bookType: type,
                    bookSST: true,
                    type: 'base64'
                }) :
                XLSX.writeFile(wb, fn || ('Detalles_'+this.setPuntos.ca_codigo_agrupado + '.' + (type || 'xlsx')));
        },
        async getinfopedido() {
            this.inputs = [];
            let me = this;
            me.$vs.loading()
            await this.$http.get(this.$server_url + 'get_val_pedidoInfoTodoSuma/' + this.sendPedido.id_pedido)
                .then(res => {
                    this.inputs = res.data;
                    me.$vs.loading.close()
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close()
                });
        },
        showError(msg) {
            this.$vs.notify({
                title: 'Error',
                text: msg,
                color: 'danger',
            });
        },
      }
    }
    </script>

    <style>
    .fixed-column {
        position: sticky;
        left: 0;
        background-color: white;
    }

    .fixed-column2 {
        position: sticky;
        top: 0;
        background-color: white;
    }
    </style>
