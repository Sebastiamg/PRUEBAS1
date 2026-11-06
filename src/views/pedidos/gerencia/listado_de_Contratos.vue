<template>
  <div>
      <div class="m-2 mb-4">
          <small>Seleccione un periodo: </small>
          <v-select :options="listaPeriodos" :reduce="listaPeriodos => listaPeriodos" label="descripcion" class="w-full" v-model="periodoSelect" @input="f_pedidos(periodoSelect.idperiodoescolar)" />
      </div>
      <div v-if="periodoSelect.idperiodoescolar != null">
          <vs-radio class="m-3" v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="1"> Pedidos Guias</vs-radio>
          <vs-radio class="m-3" v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="0">Pedidos Textos</vs-radio>
          <vs-radio class="m-3" v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="2">Liquidados</vs-radio>
          <vs-radio class="m-3" v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="3">Anticipos</vs-radio>
      </div>
      <div class="m-2 mb-4">
          <vs-table search :data="listaContratos">
              <template slot="header">
                  <vs-chip color="primary" class="ml-1">Cantidad: {{listaContratos.length}}</vs-chip>
              </template>
              <template slot="thead">
                  <vs-th width="25%" sort-key="apellidos">Asesor / Responsable</vs-th>
                  <vs-th width="30%" sort-key="total_venta" v-if="filtro != 1 ">detalles</vs-th>
                  <vs-th v-if="filtro != 1 ">Trazabilidad</vs-th>
              </template>
              <template slot-scope="{data}">
                  <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                      <vs-td> <small>id: </small> {{tr.id_pedido}} <br />
                          <small><b>asesor:</b></small> {{tr.nombres}} {{tr.apellidos}}<br />
                          <small><b>escuela:</b></small> {{tr.nombreInstitucion}} <br />
                          <small><b>ciudad:</b></small> {{ tr.ciudad }}<br />
                          <vs-button type="border" @click="f_detalle_libros(tr)">ver libros...</vs-button>
                      </vs-td>
                      <vs-td v-if="filtro != 1 ">
                          <small><b>venta: </b></small> <span> {{tr.tipo_venta_descr}}</span><br />
                          <small><b>convenio: </b></small> <span> {{tr.convenio_anios}}</span><br />
                          <small><b>VENTA TOTAL: </b></small> <b class="text-success"> {{tr.total_venta}}</b><br />
                          <small><b>porcentaje: </b></small> <span> {{tr.porcentaje_descuento}}</span><br />
                          <small><b>anticipo aprobado: </b></small> <span> {{tr.anticipo_aprobado}}</span><br />
                          <small><b>pendiente liquidar: </b></small> <span> {{tr.pendiente_liquidar}}</span><br />
                          <small><b>unidades: </b></small> <span> {{tr.total_unidades}}</span><br />
                          <small><b>guias: </b></small> <span> {{tr.total_unidades_guias}}</span><br />
                          <small><b>fecha envio: </b></small> <span> {{tr.fecha_envio.substring(0,10)}}</span><br />
                          <small><b>fecha entrega: </b></small> <span> {{tr.fecha_entrega.substring(0,10)}}</span><br />
                          <small><b>despacho bodega: </b></small> <span> {{tr.fecha_entrega_bodega != null ?  tr.fecha_entrega_bodega.substring(0,10) : ''}}</span><br />
                      </vs-td>
                      <vs-td v-if="filtro != 1 ">
                          <small><b>pedido solicitado: </b></small> {{ tr.ph_fecha_creacion_pedido }}<br />
                          <small><b>contrato generado:</b></small>{{ tr.fecha_generar_contrato }}<br />
                          <small><b>contrato: </b></small><b><u class="text-primary"> {{ tr.contrato_generado }}</u></b><br />
                          <small><b>anticipo aprobado:</b></small>{{ tr.fecha_aprobacion_anticipo_gerencia }}<br />
                          <small><b>anticipo rechazado:</b></small>{{ tr.fecha_rechazo_gerencia }}<br />
                          <small><b>cheque generado:</b></small>{{ tr.fecha_subir_cheque }}<br />
                          <small><b>cheque entregado al asesor:</b></small>{{ tr.fecha_envio_cheque_for_asesor }}<br />
                          <small><b>pagaré firmado:</b></small>{{ tr.fecha_orden_firmada }}<br />
                          <small><b>pagaré entregado en oficina:</b></small>{{ tr.fecha_que_recibe_orden_firmada }}<br />
                          <small><b>tipo: </b></small> <i :class="tr.ph_tipo_pago == 0 ? 'text-warning' : 'text-success'"> <b>{{ tr.ph_tipo_pago == '0' ? 'Anticipo' : 'Liquidado' }}</b></i><br />
                      </vs-td>
                  </vs-tr>

              </template>
          </vs-table>
      </div>
      <vs-popup title="Detalle de libros" :active.sync="modalLibros">
          <vs-table max-items="100" search pagination :data="arregloLibros">
              <template slot="header">
                  <div class="row">
                    <div class="col-12">Total Libros: <b>{{totalLibros}}</b></div>
                    <div class="col-12">Items: <b>{{arregloLibros.length}}</b></div>
                  </div>
              </template>
              <template slot="thead">
                  <vs-th>Libro</vs-th>
                  <vs-th>Cant. unidades</vs-th>
                  <vs-th>Precio unitario</vs-th>
              </template>
              <template slot-scope="{data}">
                  <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                      <vs-td>
                          {{data[indextr].nombrelibro}}<br>
                      </vs-td>
                      <vs-td>
                          {{data[indextr].valor}}<br>
                      </vs-td>
                      <vs-td>
                          {{tr.precio}}
                      </vs-td>
                  </vs-tr>
              </template>
          </vs-table>
      </vs-popup>
  </div>
  </template>

  <script>
  import vSelect from 'vue-select';
  export default {
      name: 'lista-de-contratos-gerencia',
      components: {
          'v-select': vSelect,
      },
      data() {
          return {
              listaPeriodos: [],
              periodoSelect: {},
              listaContratos: [],
              listaContratosTmp: [],
              noroot: '',
              tipo_pedido: 0,
              filtro: 0,
              arregloLibros: [],
              modalLibros: false,
              totalLibros: 0,
          }
      },
      mounted() {
          let me = this;
          me.usuario = JSON.parse(localStorage.getItem('usuario'));
          me.getPeriodos();
      },
      methods: {
          getPeriodos() {
              let me = this;
              this.$http.get(this.$server_url + 'periodoActivo')
                  .then((result) => {
                      // console.log(result.data)
                      me.listaPeriodos = result.data
                  }).catch((err) => {
                      console.log(err)
                  });
          },
          f_pedidos(idperiodo) {
              let me = this;
              console.log(idperiodo)
              if (idperiodo == null) {
                  return
              }
              me.$vs.loading()
              this.$http.get(this.$server_url + 'reportePedidosLibrosGuias/' + idperiodo)
                  .then((result) => {
                      console.log(result.data)
                      me.listaContratosTmp = result.data
                      me.filtroTipo();
                      me.$vs.loading.close()
                  }).catch((err) => {
                      console.log(err)
                      me.$vs.loading.close()
                  });
          },
          filtroTipo() {
              let me = this;
              console.log(me.filtro)
              if (me.filtro == 0) {
                  let datos = me.listaContratosTmp.filter(p => (p.tipo == 0));
                  me.listaContratos = datos
                  return
              }
              if (me.filtro == 1) {
                  let datos = me.listaContratosTmp.filter(p => (p.tipo == 1));
                  me.listaContratos = datos
                  return
              }
              if (me.filtro == 2) {
                  let datos = me.listaContratosTmp.filter(p => (p.ph_tipo_pago == 1));
                  me.listaContratos = datos
                  return
              }
              if (me.filtro == 3) {
                  let datos = me.listaContratosTmp.filter(p => (p.ph_tipo_pago == 0));
                  me.listaContratos = datos
                  return
              }
          },
          f_detalle_libros(item) {
              console.log(item)
              let me = this
              me.modalLibros = true;
              me.$vs.loading()
              this.$http.get(this.$server_url + 'get_val_pedidoInfo/' + item.id_pedido)
                  .then(res => {
                      console.log(res.data)
                      let datos = res.data
                      me.arregloLibros = datos.filter(p => p.valor > 0)
                      me.totalLibros = datos.reduce((acc, valor) => {
                          const respuesta = acc + valor.valor
                          return respuesta
                      }, 0)
                      me.$vs.loading.close()
                  })
          },
          f_notificaciones(msj, color, icono) {
              let me = this;
              me.$vs.notify({
                  text: msj,
                  color: color,
                  iconPack: 'feather',
                  icon: icono
              })
              return;
          }
      },
  }
  </script>
