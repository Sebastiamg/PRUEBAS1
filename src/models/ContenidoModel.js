const INPUT_TYPE = {
  TEXT: "texto corto",
  DROPDOWN: "menu de opciones",
  TEXT_EDITOR: "editor de texto",
};

import AreaModel from "./AreaModel";

export default class ContenidoModel {
  constructor(data) {
    this.AreaModel = new AreaModel(data.area);
    this.title = data.nombreformato;
    this.contenido = data.contenidoformato;
  }

  getTipo(tipo) {}
}

export { INPUT_TYPE };
