<template>
  <div>
    <h1 style="text-align:center; font-weigth:100;">Reporte estadistico de Docentes</h1>
    <br>
    <e-charts autoresize :options="pie" ref="pie" auto-resize />
  </div>

</template>

<script>
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/chart/pie";

export default {
  data() {
    return {
      docentes:[],
      filtro:[],
      recursos1insti: "",
      recursos2insti: "",
      recursos3insti: "",
      recursos4insti: "",
      recursos5insti: "",
      recursos6insti: "",
      recursos7insti: "",
      recursos8insti: "",
      recursos9insti: "",
      recursos10insti: "",
      recursos11insti: "",
      recursos12insti: "",
      recursos13insti: "",
      recursos14insti: "",
      pie: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "libros",
            "unidades",
            "cuadernos",
            "teletarea",
            "proyectos",
            "propuestas",
            "juegos",
            "material",
            "articulos",
            "tareas",
            "pdf guia",
            "pdf sin guia",
            "guia didactica",
            
          ],

        },
        series: [
          {
            name: "Contenido",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            color: ["#FFD5CC", "#EE6345", "#B73E24", "#DCB42B", "#8E7314","#F1E70B", "#6A99E5", "#6F8D2A", "#23E3B8", "#39AD93","#ED3F69", "#B83FED", "#5A1CC6", "#1C24C6", "#0C6F74"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
    };
  },
  components: {
    ECharts,
  },
  created() {
    this.docentes =  JSON.parse(localStorage.getItem("historicoDocenteArreglo"));
    let transformaraParse = JSON.parse(
      localStorage.getItem("historicoDocenteArreglo")
    );
    //paa obtener el historico de recusos
    this.recursos1insti = transformaraParse.filter(
      (p) => p.recurso == "1"
    ).length;
    this.recursos2insti = transformaraParse.filter(
      (p) => p.recurso == "2"
    ).length;
    this.recursos3insti = transformaraParse.filter(
      (p) => p.recurso == "3"
    ).length;
    this.recursos4insti = transformaraParse.filter(
      (p) => p.recurso == "4"
    ).length;
    this.recursos5insti = transformaraParse.filter(
      (p) => p.recurso == "5"
    ).length;
    this.recursos6insti = transformaraParse.filter(
      (p) => p.recurso == "6"
    ).length;
    this.recursos7insti = transformaraParse.filter(
      (p) => p.recurso == "7"
    ).length;
    this.recursos8insti = transformaraParse.filter(
      (p) => p.recurso == "8"
    ).length;
    this.recursos9insti = transformaraParse.filter(
      (p) => p.recurso == "9"
    ).length;
    this.recursos10insti = transformaraParse.filter(
      (p) => p.recurso == "10"
    ).length;
    this.recursos11insti = transformaraParse.filter(
      (p) => p.recurso == "11"
    ).length;
    this.recursos12insti = transformaraParse.filter(
      (p) => p.recurso == "12"
    ).length;
    this.recursos13insti = transformaraParse.filter(
      (p) => p.recurso == "13"
    ).length;
    this.recursos14insti = transformaraParse.filter(
      (p) => p.recurso == "14"
    ).length;

    // asignar dato al pie

    this.pie.series[0].data = [
      { value: this.recursos1insti, name: "libros" },
      { value: this.recursos2insti, name: "unidades" },
      { value: this.recursos3insti, name: "cuadernos" },
      { value: this.recursos4insti, name: "teletarea" },
      { value: this.recursos5insti, name: "proyectos" },
      { value: this.recursos6insti, name: "adaptaciones" },
      { value: this.recursos7insti, name: "propuestas" },
      { value: this.recursos8insti, name: "juegos" },
      { value: this.recursos9insti, name: "material" },
      { value: this.recursos10insti, name: "articulos" },
      { value: this.recursos11insti, name: "tareas" },
      { value: this.recursos12insti, name: "pdf guia" },
      { value: this.recursos13insti, name: "pdf sin guia"},
      { value: this.recursos14insti, name: "guia didactica"},
    ];

      //para filtrar los que tienen mayor a cero
      let transformar3=this.pie.series[0].data;
      this.filtro = transformar3.filter(
      (p) => p.value > "0"
     );

    this.pie.series[0].data = this.filtro;

    
  },
  mounted() {
    let dataIndex = -1;
    let pie = this.$refs.pie;
let dataLen = pie.options.series[0].data.length;
    setInterval(() => {
      pie.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex,
      });
      dataIndex = (dataIndex + 1) % dataLen;
      pie.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex,
      });
      pie.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex,
      });
    }, 1000);
  },
};
</script>