const ANIO_NIVEL = [
  {
    level: "inicial 1",
    name: "Inicial 1",
  },
  {
    level: "inicial 2",
    name: "Inicial 2",
  },
  {
    level: "1",
    name: "Primero",
  },
  {
    level: "2",
    name: "Segundo",
  },
  {
    level: "3",
    name: "Tercero",
  },
  {
    level: "4",
    name: "Cuarto",
  },
  {
    level: "5",
    name: "Quinto",
  },
  {
    level: "6",
    name: "Sexto",
  },
  {
    level: "7",
    name: "Séptimo",
  },
  {
    level: "8",
    name: "Octavo",
  },
  {
    level: "9",
    name: "Noveno",
  },
  {
    level: "10",
    name: "Décimo",
  },
  {
    level: "1 bgu",
    name: "Primero BGU",
  },
  {
    level: "2 bgu",
    name: "Segundo BGU",
  },
  {
    level: "3 bgu",
    name: "Tercero BGU",
  },
];

export default class LibroModel {
  constructor(data) {
    this.id = data.idlibro;
    this.nombre = this.removeSerieFromName(data.nombrelibro, data.nombre_serie);
    this.asignatura = data.asignatura;
    this.serie = data.nombre_serie;
    this.anio = this.getAnio(data);
  }

  removeSerieFromName(name, serie) {
    const nameUpper = name.toUpperCase();
    const serieUpper = serie.toUpperCase();

    if (nameUpper.includes("RUTA DEL APRENDIZAJE")) {
      return nameUpper.replace("RUTA DEL APRENDIZAJE", "");
    }

    if (nameUpper.includes(serieUpper)) {
      return nameUpper.replace(serieUpper, "");
    } else {
      return nameUpper;
    }
  }

  getAnio(data) {
    let resAnio;
    if (data.anio) {
      let anioVal = data.anio.toLowerCase();
      if (anioVal.includes("inicial")) {
        resAnio = ANIO_NIVEL.find((item) => item.level === anioVal).name;
      } else if (anioVal.includes("bgu")) {
        resAnio = ANIO_NIVEL.find((item) => item.level === anioVal).name;
      } else {
        anioVal = anioVal.replace(/\D/g, "");
        resAnio = ANIO_NIVEL.find((item) => item.level === anioVal).name;
      }
    } else {
      const anioVal = data.nombrelibro.match(/\d+/)[0];
      const indexPos = data.nombrelibro.indexOf(anioVal);
      const anioLibro = data.nombrelibro.slice(
        indexPos,
        data.nombrelibro.length
      );

      if (anioLibro.includes("inicial")) {
        resAnio = ANIO_NIVEL.find((item) => item.level === anioLibro).name;
      } else if (anioLibro.includes("bgu")) {
        resAnio = ANIO_NIVEL.find((item) => item.level === anioLibro).name;
      } else {
        resAnio = ANIO_NIVEL.find((item) => item.level === anioVal).name;
      }
    }

    return resAnio;
  }
}
