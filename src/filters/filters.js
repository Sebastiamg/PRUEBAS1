import Vue from "vue";

Vue.filter("title", function (value, replacer = "_") {
  if (!value) return "";
  value = value.toString();

  const arr = value.split(replacer);
  const capitalized_array = [];
  arr.forEach((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    capitalized_array.push(capitalized);
  });
  return capitalized_array.join(" ");
});

Vue.filter("fechaLarga", function (date) {
  var d = new Date(date);
  var dia = new Array(7);
  dia = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  var mesok = new Array(12);
  mesok = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  var datestring =
    dia[d.getDay()] +
    " " +
    d.getDate() +
    " de " +
    mesok[d.getMonth()] +
    " del " +
    d.getFullYear() +
    " a las " +
    d.getHours() +
    ":" +
    d.getMinutes();
  return datestring;
});

Vue.filter("fechaCorta", function (d) {
  var datestring = "";
  let date = new Date(d);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hora = date.getHours();
  let minuto = date.getMinutes();
  let mmes = "";
  let dday = "";

  if (month < 10) {
    mmes = `0${month}`;
  } else {
    mmes = `${month}`;
  }
  if (day < 10) {
    dday = `0${day}`;
  } else {
    dday = `${day}`;
  }
  datestring = `${year}-${mmes}-${dday} ${hora}:${minuto}:00`;
  return datestring;
});

Vue.filter("filtrarDecimal", function (numero) {
  try {
    if (
      numero == 0 ||
      numero == undefined ||
      isNaN(numero) ||
      numero == null
    ) {
      return 0;
    } else {
      const transformar = numero
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
      return transformar;
    }
  } catch (error) {
    console.error(error);
    return 0;
  }
});

Vue.filter("filtrarDecimal2", function (numero) {
  try {
    if (
      numero == 0 ||
      numero == undefined ||
      isNaN(numero) ||
      numero == null
    ) {
      return 0;
    } else {
      // Formato europeo: punto para miles, coma para decimales
      const transformar = numero
        .toFixed(2)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return transformar;
    }
  } catch (error) {
    console.error(error);
    return 0;
  }
});

