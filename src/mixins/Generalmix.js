
export default {
  data(){
      return{
      myVariable:10,
      }
  },
  methods: {
    async m_message(mensaje="Ingresar mensaje", color="success", icono="icon-check",time="4000") {
      let me = this;
      me.$vs.notify({
        text: mensaje,
        color: color,
        iconPack: 'feather',
        icon: icono,
        time: time
      })
      return;
    }
  },
};
