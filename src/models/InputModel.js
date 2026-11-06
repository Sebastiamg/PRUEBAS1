export default class InputModel {
  constructor(label, tipo, opciones) {
    this.label = label;
    this.tipo = tipo;
    this.opciones = this.getOpciones(opciones);
  }

  getTipo(tipo) {
    switch (tipo) {
      case "texto corto":
        return "text";
      case "menu de opciones":
        return "select";
      case "editor de texto":
        return "textarea";
      default:
        return "text";
    }
  }

  getOpciones(opciones) {
    console.log(opciones);
    if (!opciones) {
      return [];
    } else {
      if (opciones.includes(",")) {
        return opciones.split(",");
      } else {
        return [opciones];
      }
    }
  }
}
