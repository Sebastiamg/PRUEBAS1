import { reject } from "core-js/fn/promise";

export default {
    data() {
      return {
        mixin_IdInicioFormatoNew: [],
      };
    },
    methods: {
      async mixin_FormatoNewId() {
        let me = this;
        return new Promise((resolve, reject) => {
        me.$vs.loading();
        return this.$http
            .get(this.$server_url + 'Gettablaconfiguracionparanuevoformato')
            .then(res => {
                // Usamos map para crear un nuevo array con solo los campos que necesitamos
                me.mixin_IdInicioFormatoNew = res.data.map(item => ({
                nombre: item.nombre,
                minimo: item.minimo,
                }));

                // Almacena el array en localStorage como JSON
                localStorage.setItem(
                    'mixin_IdInicioFormatoNew',
                    JSON.stringify(me.mixin_IdInicioFormatoNew)
                );
                me.$vs.loading.close();
                resolve();
            })
            .catch(err => {
                console.log(err);
                me.$vs.loading.close();
                reject(err);
                throw err; // Lanza el error para que pueda ser manejado en `mounted`
            });
        });
      },
    },
  };