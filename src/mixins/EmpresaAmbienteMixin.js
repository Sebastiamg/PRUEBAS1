/**
 * Mixin reutilizable para mostrar el indicador de ambiente de empresa
 *
 * USO:
 * 1. Importar el mixin en tu componente:
 *    import EmpresaAmbienteMixin from '@/mixins/EmpresaAmbienteMixin.js';
 *
 * 2. Agregarlo al componente:
 *    mixins: [EmpresaAmbienteMixin],
 *
 * 3. Mostrar el ambiente enviando solo el ID:
 *    this.mostrarAmbientePorId(empresaId);
 *
 * 4. O usar directamente en cualquier componente sin el mixin:
 *    this.$store.dispatch('mostrarAmbienteEmpresa', empresaId);
 */

export default {
    methods: {
        /**
         * Muestra el indicador de ambiente enviando solo el ID de la empresa
         * La API de empresa se consulta automáticamente
         * @param {Number} empresaId - El ID de la empresa
         */
        mostrarAmbientePorId(empresaId) {
            this.$store.dispatch('mostrarAmbienteEmpresa', empresaId);
        },

        /**
         * Oculta manualmente el indicador de ambiente
         */
        ocultarAmbienteEmpresa() {
            this.$store.commit('OCULTAR_AMBIENTE_EMPRESA');
        },

        /**
         * Verifica si la empresa está en ambiente de producción
         * @param {Object} empresa - El objeto empresa
         * @returns {Boolean}
         */
        esAmbienteProduccion(empresa) {
            return empresa?.perseo_enviroment == 1;
        },

        /**
         * Verifica si la empresa está en ambiente local
         * @param {Object} empresa - El objeto empresa
         * @returns {Boolean}
         */
        esAmbienteLocal(empresa) {
            return empresa?.perseo_enviroment == 0 || empresa?.perseo_enviroment === undefined;
        }
    }
};
