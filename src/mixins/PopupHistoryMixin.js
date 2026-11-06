/**
 * PopupHistoryMixin - Manejo de historial del navegador para popups anidados
 * 
 * USO:
 * 1. Importar: import PopupHistoryMixin from '@/mixins/PopupHistoryMixin'
 * 2. Agregar a mixins: mixins: [PopupHistoryMixin]
 * 3. En created(): this.registerPopupHistory('nombreVariablePopup')
 * 
 * CARACTERÍSTICAS:
 * - Maneja múltiples popups anidados (cascada)
 * - Cierre en orden LIFO (último abierto, primero cerrado)
 * - Previene duplicación de estados en el historial
 * - Detecta botón atrás vs cierre programático
 */

export default {
    data() {
        return {
            _popupHistoryWatched: [],
            _isHistoryBack: false,
        }
    },
    mounted() {
        window.addEventListener('popstate', this._handleHistoryPopState)
    },
    beforeDestroy() {
        window.removeEventListener('popstate', this._handleHistoryPopState)
    },
    methods: {
        /**
         * Registra una variable booleana para ser manejada por el historial del navegador.
         * @param {String} variableName Nombre de la variable en data()
         */
        registerPopupHistory(variableName) {
            // Inicializar el array si no existe (por si acaso)
            if (!this._popupHistoryWatched) {
                this._popupHistoryWatched = []
            }

            // Evitar duplicados en el registro
            if (this._popupHistoryWatched.includes(variableName)) {
                console.log(`⚠️ [PopupMixin] ${variableName} ya está registrado`)
                return
            }

            this._popupHistoryWatched.push(variableName)
            console.log(`📝 [PopupMixin] Registrado popup: ${variableName}`)

            this.$watch(variableName, (val) => {
                console.log(`👁️ [PopupMixin] Watch detectado cambio en ${variableName}:`, val)
                if (val) {
                    this._onPopupOpen(variableName)
                } else {
                    this._onPopupClose(variableName)
                }
            })
        },

        /**
         * Maneja la apertura de un popup
         */
        _onPopupOpen(variableName) {
            const state = window.history.state || {}
            const stack = state._popupStack || []

            console.log(`🟢 [PopupMixin] Abriendo popup: ${variableName}`)
            console.log(`   Stack actual:`, stack)

            // PREVENIR DUPLICADOS: Si el popup ya está en el stack, no agregarlo de nuevo
            if (stack.includes(variableName)) {
                console.log(`   ⚠️ Ya existe en el stack, no se duplica`)
                this._isHistoryBack = false
                return
            }

            // Agregar al stack (LIFO)
            const newStack = [...stack, variableName]
            const newState = {
                ...state,
                _popupStack: newStack,
                [variableName]: true
            }

            console.log(`   ✅ Agregado al stack:`, newStack)
            window.history.pushState(newState, '')
            this._isHistoryBack = false
        },

        /**
         * Maneja el cierre de un popup
         */
        _onPopupClose(variableName) {
            const state = window.history.state || {}
            const stack = state._popupStack || []

            console.log(`🔴 [PopupMixin] Cerrando popup: ${variableName}`)
            console.log(`   isHistoryBack:`, this._isHistoryBack)
            console.log(`   Stack actual:`, stack)

            if (this._isHistoryBack) {
                // Cerrado vía botón ATRÁS del navegador
                // El estado ya fue removido automáticamente por el navegador
                console.log(`   ⬅️ Cerrado por botón ATRÁS`)
                this._isHistoryBack = false
            } else {
                // Cerrado PROGRAMÁTICAMENTE (ej. click en botón cerrar)
                console.log(`   🖱️ Cerrado programáticamente`)
                // Solo retroceder si este popup está en el stack actual
                if (stack.includes(variableName)) {
                    // IMPORTANTE: Verificar que sea el ÚLTIMO en el stack (LIFO)
                    const lastPopup = stack[stack.length - 1]

                    if (lastPopup === variableName) {
                        // Es el último, podemos retroceder normalmente
                        console.log(`   ✅ Es el último en el stack, retrocediendo...`)
                        window.history.back()
                    } else {
                        // NO es el último - hay popups anidados encima
                        // Cerrar todos los que están encima primero (cascada)
                        console.log(`   ⚠️ NO es el último, cerrando en cascada...`)
                        const indexToClose = stack.indexOf(variableName)
                        const popupsToClose = stack.slice(indexToClose)

                        console.log(`   Popups a cerrar:`, popupsToClose)

                        // Cerrar todos los popups desde este hacia arriba
                        popupsToClose.forEach(popupName => {
                            if (this[popupName] && popupName !== variableName) {
                                this._isHistoryBack = true
                                this[popupName] = false
                            }
                        })

                        // Finalmente retroceder en el historial
                        window.history.go(-popupsToClose.length)
                    }
                } else {
                    console.log(`   ⚠️ No está en el stack, no se retrocede`)
                }
            }
        },

        /**
         * Maneja el evento popstate (botón atrás/adelante del navegador)
         */
        _handleHistoryPopState(event) {
            const newState = event.state || {}
            const newStack = newState._popupStack || []

            console.log(`⬅️ [PopupMixin] PopState detectado`)
            console.log(`   Nuevo stack:`, newStack)

            // Obtener el estado actual (antes del popstate)
            const currentState = this._getCurrentPopupState()
            console.log(`   Popups abiertos actualmente:`, currentState)

            // Detectar qué popups deben cerrarse
            currentState.forEach(variableName => {
                // Si estaba abierto pero ya no está en el nuevo stack, cerrarlo
                if (!newStack.includes(variableName)) {
                    console.log(`   🔴 Cerrando ${variableName} (ya no está en el stack)`)
                    this._isHistoryBack = true
                    this[variableName] = false
                }
            })
        },

        /**
         * Obtiene el estado actual de los popups (cuáles están abiertos)
         */
        _getCurrentPopupState() {
            if (!this._popupHistoryWatched) return []
            return this._popupHistoryWatched.filter(variableName => this[variableName] === true)
        }
    }
}
