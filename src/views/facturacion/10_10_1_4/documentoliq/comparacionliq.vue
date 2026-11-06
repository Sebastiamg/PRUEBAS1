<template>
  <vx-card class="crear" title="Busqueda por Institución">
    <vs-row vs-justify="flex-start">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
        <TableSelectInstitucionVue
          @change="changeHandle"
          style="margin-top: -25px"
          :hacerValidacion='Number(0)'
        />
        <!-- <vs-button
          color="primary"
          type="border"
          icon="search"
          @click="getListar(institucion_id)"
        ></vs-button> -->
      </vs-col>
    </vs-row>
    <vx-card class="crear" title="Busqueda por Periódo">
      <vs-row vs-justify="left" vs-w="12" class="buscar" :active.sync="Activo">
        <v-select
          :options="options1"
          :reduce="(options1) => options1"
          label="text"
          class="small"
          value="value"
          v-model="tabPeriodo.id"
        />

        <vs-button
          color="primary"
          type="border"
          icon="search"
          @click="getListarxPeriodo(institucion_id, tabPeriodo.id.value)"
        ></vs-button>
      </vs-row>
    </vx-card>
    <vs-row>
      <vs-col
        vs-justify="center"
        vs-align="space-between"
        vs-lg="12"
        vs-sm="12"
        vs-xs="12"
      >
        <vs-row vs-type="flex" vs-justify="space-between" vs-w="12">
          <vs-col vs-type="flex" vs-w="5" vs-sm="12" vs-lg="5">
            <vs-table max-items="10" pagination :data="Listar1">
              <template slot="header">
			  <vs-divider>3 AÑOS POSTERIORES AL AÑO SELECCIONADO</vs-divider>
            <br>
                <vs-chip color="primary"
                  >Cantidad: <b> {{ Listar1.length }}</b></vs-chip
                >
              </template>
              <!-- {{cliCi}} -->
              <template slot="thead">
                <vs-th width="300"> Id Contrato </vs-th>
                <vs-th width="600"> Información contrato </vs-th>
                <vs-th width="100"> Periódo</vs-th>
              </template>
              <template slot-scope="{ data }">
                <vs-tr :key="indextr" v-for="(td, indextr) in data">
                  <vs-td :data="data[indextr].doc_codigo">
                    {{ td.contrato }} <br />
                  </vs-td>
                  <vs-td>
                    <br />
                    <small><b>Valor contrato $:</b> {{ td.ven_valor }}</small
                    ><br />
                    <small><b>Comisión $:</b> {{ td.ven_descuento }} % </small><br />
                    <small
                      >Anticipo $: <b>{{ td.anticipo.toFixed(2) }}</b></small
                    ><br />
                    <small
                      >Liquidación $:
                      <b v-if="td.liquidacion < 0" class="text-danger">{{
                        td.liquidacion
                      }}</b>
                      <b v-else>{{ td.liquidacion }}</b></small
                    ><br />
                  </vs-td>
                  <vs-td> {{ td.periodo }} <br /> </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </vs-col>

          <vs-col vs-type="flex" vs-w="5" vs-sm="12" vs-lg="5">
            <vs-table max-items="10" pagination :data="arregloMostrar">
              <template slot="header">
			  <vs-divider>ULTIMOS 3 PEDIDOS </vs-divider>
            <br>
                <vs-chip color="primary"
                  >Cantidad: <b> {{ arregloMostrar.length }}</b></vs-chip
                >
              </template>
              <template slot="thead">
                <vs-th width="300">Id Contrato </vs-th>
                <vs-th width="600"> Información contrato </vs-th>
                <vs-th width="100"> Periódo</vs-th>
              </template>
              <template slot-scope="{ data }">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].doc_codigo">
                    {{ tr.contrato }} <br />
                  </vs-td>

                  <vs-td>
                    <br />
                    <small
                      >Anticipo $: <b>{{ tr.anticipo.toFixed(2) }}</b></small
                    ><br />
                    <small
                      >Liquidación $:
                      <b v-if="tr.liquidacion < 0" class="text-danger">{{
                        tr.liquidacion
                      }}</b>
                      <b v-else>{{ tr.liquidacion }}</b></small
                    ><br />
                  </vs-td>
                  <vs-td> {{ tr.PERIODO }} <br /> </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>
  </vx-card>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import { mapState } from "vuex";
import vSelect from "vue-select";
import TableSelectInstitucionVue from "../../../usuarios/GestionEstudiantes/components/TableSelectInstitucion.vue";
export default {
  data() {
    return {
      arregloMostrar: [],

      Activo: false,

      tabPeriodo: {
        id: "",
      },
      Lista: [],
      Listar: [],
      Listar1: [],
      busquedaxcodigo: "",
      valorBusqueda: "0",

      checkBox_mostrarinactivos: false,
      options1: [
        { text: "2024 2024", value: "24" },
        { text: "2023 2023", value: "23" },
        { text: "2022 2022", value: "22" },
        { text: "2021 2021", value: "21" },
        { text: "2020 2020", value: "20" },
      ],
    };
  },

  computed: {
    ...mapState(["auth", "userRoot", "susuario"]),
  },

  components: {
    TableSelectInstitucionVue,
    "v-select": vSelect,
  },
  mounted() {
    var institucion_id = "";
  },
  methods: {
    changeHandle(e) {
      let me = this;
      let valor = e.change;
      if (valor == "institucion"){ 
		  me.institucion_id = e.value;
		  me.arregloMostrar = [];
		  me.Listar1 = [];
		  me.tabPeriodo.id = "";
		  me.getListar(me.institucion_id);
	  }
    },
    getListar(Id) {
      let me = this;
      me.$vs.loading();
      this.Activo = true;
      this.$http
        .get(
          this.$server_url +
            "Get_Cliente_Institucionx3pedidosanteriores?id_institucion=" +
            Id
        )

        .then((res) => {
          me.$vs.loading.close();
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: "danger",
              iconPack: "feather",
              icon: "icon-check",
            });
          }
          this.Lista = res.data;
          if (me.Lista.length > 0) {
            me.renderValores(me.Lista);
          }else{
            me.$vs.notify({
              text: "No hay anticipos para esta institución",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          }

          me.$vs.loading.close();
        })
        .catch((err) => {
          if (err.response.status == 500) {
            me.$vs.notify({
              text: "No hay Instituciones de esta búsqueda",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
            me.Lista = [];
            me.$vs.loading.close();
          } else {
            me.$vs.loading.close();
          }
        });
    },
    renderValores(tr) {
      let me = this;
      var agruparPeriodos = [];
      var datosSeteados = [];
      tr.forEach((element) => {
        var cal = new Object();
        cal.PERIODO = element.PERIODO;
        agruparPeriodos.push(cal);
      });
      //QUITAR ARRAYS DUPLICADOS
      let hash = {};
      let resultado = agruparPeriodos.filter((o) =>
        hash[o.PERIODO] ? false : (hash[o.PERIODO] = true)
      );
      datosSeteados = resultado;
      //ingresar valores en el PERIODO
      datosSeteados.map((p) => {
        p["valores"] = tr.filter((s) => s.PERIODO == p.PERIODO);
        return p;
      });
      let ArregloOrdenar = [];
      //separar los anticipos y liquidacion
      datosSeteados.forEach((element) => {
        var cal = new Object();
        cal.PERIODO = element.PERIODO;
        cal.estado_contrato = element.valores[0].estado_contrato;
        cal.contrato = element.valores[0].ven_codigo;
        cal.ven_valor = element.valores[0].venValor;
        cal.ven_descuento = element.valores[0].venDescuento;
        cal.anticipos = element.valores.filter((p) => p.doc_ci == "ANT");
        cal.liquidados = element.valores.filter((p) => p.doc_ci == "LIQ");
        ArregloOrdenar.push(cal);
      });
      let mostrarValores = [];
      ArregloOrdenar.forEach((element) => {
        var cal = new Object();
        cal.PERIODO = element.PERIODO;
        cal.estado_contrato = element.estado_contrato;
        cal.contrato = element.contrato;
        cal.ven_valor = element.ven_valor;
        cal.ven_descuento = element.ven_descuento;
        let array = element.anticipos;
        let array2 = element.liquidados;
        cal.anticipo = array.reduce(
          (a, b) => parseFloat(a) + parseFloat(b["doc_valor"] || 0),
          0
        );
        cal.liquidacion = array2.reduce(
          (a, b) => parseFloat(a) + parseFloat(b["doc_valor"] || 0),
          0
        );
        mostrarValores.push(cal);
      });
      //ORDENAR LOS PERIODOS
      me.arregloMostrar = mostrarValores.sort((a, b) => {
        if (a.PERIODO < b.PERIODO) {
          return 1;
        }
        if (a.PERIODO > b.PERIODO) {
          return -1;
        }
        return 0;
      });
      console.log(me.arregloMostrar);
      //====DEUDA====
      //si existe deuda mandar a guardar la deuda y asignar como anticipo aprobado
      var deuda = me.arregloMostrar[0];
      var getDeuda = parseFloat(deuda.liquidacion);
      //deuda
      if (getDeuda < 0) {
        //si  ya existe un valor en el anticipo aprobado no actualizo
        if (
          me.anticipoAprobado == 0 ||
          me.anticipoAprobado == null ||
          me.anticipoAprobado == ""
        ) {
          let datos = {
            setDeuda: getDeuda,
            periodo: deuda.periodo,
          };
          me.$emit("sendDeuda", datos);
        }
      }
    },
    getListarxPeriodo(Id, per) {
      let me = this;
      me.$vs.loading();
      this.$http
        .get(
          this.$server_url +
            "Get_Cliente_Institucionx3yearanterior?id_institucion=" +
            Id +
            "&ven_codigo=" +
            per
        )

        .then((res) => {
          me.$vs.loading.close();
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: "danger",
              iconPack: "feather",
              icon: "icon-check",
            });
          }
          this.Listar = res.data;
          if (me.Listar.length > 0) {
            me.renderValores1(me.Listar);
          }else{
            me.$vs.notify({
              text: "No hay anticipos para esta institución",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          }

          me.$vs.loading.close();
        })
        .catch((err) => {
          console.log(err);
          me.$vs.loading.close();
        });
    },
    renderValores1(tr) {
      let me = this;
      var agruparPeriodos = [];
      var datosSeteados = [];
      tr.forEach((element) => {
        var cal = new Object();
        cal.periodo = element.periodo;
        agruparPeriodos.push(cal);
      });
      //QUITAR ARRAYS DUPLICADOS
      let hash = {};
      let resultado = agruparPeriodos.filter((o) =>
        hash[o.periodo] ? false : (hash[o.periodo] = true)
      );
      datosSeteados = resultado;
      //ingresar valores en el periodo
      datosSeteados.map((p) => {
        p["valores"] = tr.filter((s) => s.periodo == p.periodo);
        return p;
      });
      let ArregloOrdenar = [];
      //separar los anticipos y liquidacion
      datosSeteados.forEach((element) => {
        var cal = new Object();
        cal.periodo = element.periodo;
        cal.estado = element.estado_contrato;
        cal.contrato = element.valores[0].ven_codigo;
        cal.ven_valor = element.valores[0].venValor;
        cal.ven_descuento = element.valores[0].venDescuento;
        cal.anticipos = element.valores.filter((p) => p.doc_ci == "ANT");
        cal.liquidados = element.valores.filter((p) => p.doc_ci == "LIQ");
        ArregloOrdenar.push(cal);
      });
      let mostrarValores = [];
      ArregloOrdenar.forEach((element) => {
        var cal = new Object();
        cal.periodo = element.periodo;
        cal.estado = element.estado_contrato;
        cal.contrato = element.contrato;
        cal.ven_valor = element.ven_valor;
        cal.ven_descuento = element.ven_descuento;
        let array = element.anticipos;
        let array2 = element.liquidados;
        cal.anticipo = array.reduce(
          (a, b) => parseFloat(a) + parseFloat(b["doc_valor"] || 0),
          0
        );
        cal.liquidacion = array2.reduce(
          (a, b) => parseFloat(a) + parseFloat(b["doc_valor"] || 0),
          0
        );
        mostrarValores.push(cal);
      });
      //ORDENAR LOS PERIODOS
      me.Listar1 = mostrarValores.sort((a, b) => {
        if (a.periodo < b.periodo) {
          return 1;
        }
        if (a.periodo > b.periodo) {
          return -1;
        }
        return 0;
      });
      console.log(me.Listar1);
      //====DEUDA====
      //si existe deuda mandar a guardar la deuda y asignar como anticipo aprobado
      var deuda = me.Listar1[0];
      var getDeuda = parseFloat(deuda.liquidacion);
      //deuda
      if (getDeuda < 0) {
        //si  ya existe un valor en el anticipo aprobado no actualizo
        if (
          me.anticipoAprobado == 0 ||
          me.anticipoAprobado == null ||
          me.anticipoAprobado == ""
        ) {
          let datos = {
            setDeuda: getDeuda,
            periodo: deuda.periodo,
          };
          me.$emit("sendDeuda", datos);
        }
      }
    },
  },
};
</script>
