<template>
<vx-card class="p-4">

    <!-- Menú flotante -->
    <transition name="menu-slide">
        <div v-if="selectedRow" class="menu-flotante" :style="menuStyle" @click.stop>
            <div class="menu-header">
                <span class="menu-titulo">Acciones</span>
                <button class="menu-cerrar" @click="cerrarMenu">✕</button>
            </div>
            <div class="menu-codigo">{{ selectedRow.codigo }}</div>
            <div class="menu-items">

                <button class="menu-item menu-item--preguntas" @click="abrirPreguntas(selectedRow); cerrarMenu()">
                    <span class="menu-item-icono"><i class="feather icon-help-circle"></i></span>
                    <span class="menu-item-texto">
                        <strong>Preguntas</strong>
                        <small>Gestionar preguntas</small>
                    </span>
                </button>

                <button class="menu-item menu-item--editar" @click="abrirEditar(selectedRow); cerrarMenu()">
                    <span class="menu-item-icono"><i class="feather icon-edit-2"></i></span>
                    <span class="menu-item-texto">
                        <strong>Editar</strong>
                        <small>Título, estado, periodo...</small>
                    </span>
                </button>

                <!-- <button class="menu-item menu-item--link" @click="verLink(selectedRow); cerrarMenu()">
                    <span class="menu-item-icono"><i class="feather icon-link"></i></span>
                    <span class="menu-item-texto">
                        <strong>Ver Link</strong>
                        <small>Enlace y QR de acceso</small>
                    </span>
                </button> -->

                <!-- <button class="menu-item menu-item--estadisticas" @click="abrirEstadisticas(selectedRow); cerrarMenu()">
                    <span class="menu-item-icono"><i class="feather icon-bar-chart-2"></i></span>
                    <span class="menu-item-texto">
                        <strong>Estadísticas</strong>
                        <small>Ver resultados y promedios</small>
                    </span>
                </button> -->

                <!-- <button class="menu-item menu-item--participantes" @click="abrirParticipantes(selectedRow); cerrarMenu()">
                    <span class="menu-item-icono"><i class="feather icon-users"></i></span>
                    <span class="menu-item-texto">
                        <strong>Participantes</strong>
                        <small>Quién respondió / pendientes</small>
                    </span>
                </button> -->

                <button class="menu-item menu-item--eliminar" @click="eliminarEncuesta(selectedRow); cerrarMenu()">
                    <span class="menu-item-icono"><i class="feather icon-trash-2"></i></span>
                    <span class="menu-item-texto">
                        <strong>Eliminar</strong>
                        <small>Solo si no tiene respuestas</small>
                    </span>
                </button>

            </div>
        </div>
    </transition>

    <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-semibold flex items-center gap-2">
            Encuestas Prolipa
            <button @click="getEncuestas()" class="refresh-btn" title="Refrescar encuestas">
                <i class="fas fa-sync-alt"></i>
            </button>
        </h4>
    </div>
    <div class="mb-4">
        <vs-button color="primary" icon="add" @click="abrirModal()">Nueva Encuesta</vs-button>
    </div>

    <vs-alert color="primary" icon="info" class="mb-4">
        <span class="font-semibold">📌 Información:</span> Solo las encuestas en estado <strong>"Habilitada"</strong> se mostrarán en las capacitaciones.
    </vs-alert>

    <vs-table :data="encuestas" search pagination max-items="10" no-data-text="No hay encuestas disponibles">

        <template slot="header">
            <vs-chip color="primary">Total: <b class="ml-1">{{ encuestas.length }}</b></vs-chip>
        </template>

        <template slot="thead">
            <vs-th>Código</vs-th>
            <vs-th>Título</vs-th>
            <vs-th>Preguntas</vs-th>
            <vs-th>Encuestas realizadas</vs-th>
            <vs-th>Descargas cert.</vs-th>
            <vs-th>Estado</vs-th>
            <vs-th>Acciones</vs-th>
        </template>

        <template slot-scope="{data}">
            <vs-tr v-for="(tr, i) in data" :key="i">

                <vs-td>
                    #{{ tr.id }} <br>
                    <span class="font-mono text-sm">{{ tr.codigo }}</span><br>
                    <span v-if="tr.creador" class="text-xs text-gray-400">
                        👤 {{ tr.creador.nombres }} {{ tr.creador.apellidos }}
                    </span>
                </vs-td>

                <vs-td>
                    <b>Título:</b>
                    <p>{{ tr.titulo }}</p>
                    <b>Descripción</b>
                    <p>{{ tr.descripcion }}</p>
                </vs-td>

                <vs-td>
                    <vs-chip :color="tr.preguntas_count > 0 ? 'primary' : 'grey'">
                        {{ tr.preguntas_count }} {{ tr.preguntas_count === 1 ? 'pregunta' : 'preguntas' }}
                    </vs-chip>
                </vs-td>

                <vs-td>
                    <vs-chip :color="tr.respuestas_count > 0 ? 'success' : 'grey'">
                        {{ tr.respuestas_count }} {{ tr.respuestas_count === 1 ? 'respuesta' : 'respuestas' }}
                    </vs-chip>
                </vs-td>

                <vs-td>
                    <vs-chip :color="tr.descargas_count > 0 ? 'primary' : 'grey'">
                        <i class="fas fa-download mr-1" style="font-size: 13px;"></i>
                        {{ tr.descargas_count || 0 }}
                    </vs-chip>
                </vs-td>

                <vs-td>
                    <vs-chip v-if="tr.estado === 'habilitada'" color="success">Activa</vs-chip>
                    <vs-chip v-else-if="tr.estado === 'borrador'" color="warning">Borrador</vs-chip>
                    <vs-chip v-else color="danger">Cerrada</vs-chip>
                </vs-td>

                <vs-td>
                    <button
                        class="menu-trigger-btn"
                        :class="{ active: selectedRow && selectedRow.id === tr.id }"
                        @click.stop="toggleMenu(tr, $event)"
                        title="Acciones"
                    >⋮</button>
                </vs-td>

            </vs-tr>
        </template>

    </vs-table>

    <!-- MODAL CREAR -->
    <vs-popup title="Nueva Encuesta" :active.sync="popup">

        <div class="mb-3">
            <label class="text-sm font-semibold">Título *</label>
            <vs-input class="w-full mt-1" v-model="form.titulo" placeholder="Título de la encuesta"/>
        </div>

        <div class="mb-4">
            <label class="text-sm font-semibold">Descripción</label>
            <vs-textarea class="w-full mt-1" v-model="form.descripcion" placeholder="Descripción opcional"/>
        </div>

        <vs-button color="success" class="w-full" @click="guardar" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar' }}
        </vs-button>

    </vs-popup>

    <!-- MODAL PREGUNTAS -->
    <vs-popup
        :title="encuestaSeleccionada ? 'Preguntas — ' + encuestaSeleccionada.titulo : 'Preguntas'"
        :active.sync="popupPreguntas"
        style="z-index:50000"
    >
        <EncuestaPreguntasProlipa
            v-if="popupPreguntas && encuestaSeleccionada"
            :encuesta="encuestaSeleccionada"
        />
    </vs-popup>

    <!-- MODAL LINK Y QR -->
    <vs-popup title="Enlace de Encuesta" :active.sync="popupLink">
        <div v-if="encuestaSeleccionada" class="p-4">

            <!-- Código QR -->
            <div class="text-center mb-6">
                <p class="text-sm text-gray-500 mb-4">Escanea el QR para acceder a la encuesta</p>
                <div class="flex justify-center mb-3">
                    <img :src="qrUrl" alt="QR Encuesta" style="width:220px;height:220px;" />
                </div>
                <p class="font-mono text-xs text-gray-400 mb-3">{{ encuestaSeleccionada.codigo }}</p>
                <div class="flex justify-center">
                    <vs-button color="primary" @click="descargarQR">
                        <i class="fas fa-download mr-2"></i>
                        Descargar QR
                    </vs-button>
                </div>
            </div>

            <!-- Separador -->
            <div class="border-t pt-6">
                <p class="text-sm text-gray-500 mb-2">O comparte este enlace:</p>
                <div class="bg-gray-100 rounded p-3 mb-4 break-all font-mono text-sm">
                    {{ linkEncuesta }}
                </div>
                <div class="flex gap-2 justify-center">
                    <vs-button color="primary" icon="content_copy" @click="copiarLink">
                        Copiar Link
                    </vs-button>
                    <vs-button color="success" icon="open_in_new" @click="abrirLink">
                        Abrir Link
                    </vs-button>
                </div>
            </div>

        </div>
    </vs-popup>

    <!-- MODAL EDITAR -->
    <vs-popup title="Editar Encuesta" :active.sync="popupEditar">
        <div v-if="formEditar" class="p-1">

            <div class="mb-3">
                <label class="text-sm font-semibold">Título *</label>
                <vs-input class="w-full mt-1" v-model="formEditar.titulo" placeholder="Título de la encuesta"/>
            </div>

            <div class="mb-4">
                <label class="text-sm font-semibold">Descripción</label>
                <vs-textarea class="w-full mt-1" v-model="formEditar.descripcion" placeholder="Descripción opcional"/>
            </div>

            <div class="mb-4">
                <label class="text-sm font-semibold block mb-2">Estado</label>
                <ul class="flex gap-4">
                    <li><vs-radio v-model="formEditar.estado" vs-value="borrador"  vs-name="estado-edit">Borrador</vs-radio></li>
                    <li>
                        <vs-radio v-model="formEditar.estado" vs-value="habilitada" vs-name="estado-edit"
                            :disabled="formEditar.preguntas_count === 0">
                            Habilitada
                        </vs-radio>
                        <span v-if="formEditar.preguntas_count === 0" class="text-xs text-danger ml-1">
                            (sin preguntas)
                        </span>
                    </li>
                    <li><vs-radio v-model="formEditar.estado" vs-value="cerrada"   vs-name="estado-edit">Cerrada</vs-radio></li>
                </ul>
            </div>

            <vs-button color="success" class="w-full" @click="guardarEditar" :disabled="guardando">
                {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
            </vs-button>

        </div>
    </vs-popup>
    <!-- MODAL PARTICIPANTES -->
    <vs-popup
        :title="encuestaSeleccionada ? 'Participantes — ' + encuestaSeleccionada.titulo : 'Participantes'"
        :active.sync="popupParticipantes"
        style="z-index:50000"
    >
        <EncuestaParticipantesProlipa
            v-if="popupParticipantes && encuestaSeleccionada"
            :encuesta="encuestaSeleccionada"
        />
    </vs-popup>

    <!-- MODAL ESTADÍSTICAS -->
    <vs-popup
        :title="encuestaSeleccionada ? 'Estadísticas — ' + encuestaSeleccionada.titulo : 'Estadísticas'"
        :active.sync="popupEstadisticas"
        style="z-index:50000"
    >
        <EncuestaEstadisticasProlipa
            v-if="popupEstadisticas && encuestaSeleccionada"
            :encuesta="encuestaSeleccionada"
        />
    </vs-popup>

</vx-card>
</template>

<script>
import vSelect from 'vue-select'
import EncuestaPreguntasProlipa from './EncuestaPreguntasProlipa.vue'
import EncuestaEstadisticasProlipa from './EncuestaEstadisticasProlipa.vue'
import EncuestaParticipantesProlipa from './EncuestaParticipantesProlipa.vue'

export default {
    components: { 'v-select': vSelect, EncuestaPreguntasProlipa, EncuestaEstadisticasProlipa, EncuestaParticipantesProlipa },

    props: {},

    data() {
        return {
            encuestas: [],
            popup: false,
            popupLink: false,
            popupPreguntas: false,
            popupEditar: false,
            popupEstadisticas: false,
            popupParticipantes: false,
            guardando: false,
            encuestaSeleccionada: null,
            selectedRow: null,
            menuPos: { top: 0, left: 0, maxH: 380 },
            form: { titulo: '', descripcion: '' },
            formEditar: null,
            usuarioLogueado: JSON.parse(localStorage.getItem('usuario')) || null
        }
    },

    computed: {
        menuStyle() {
            return {
                position: 'fixed',
                top:      this.menuPos.top  + 'px',
                left:     this.menuPos.left + 'px',
                zIndex:   99999,
                maxHeight: (this.menuPos.maxH || 380) + 'px',
                overflowY: 'auto'
            }
        },
        linkEncuesta() {
            if (!this.encuestaSeleccionada) return ''
            return `${window.location.origin}/encuesta/prolipa/${this.encuestaSeleccionada.codigo}`
        },
        qrUrl() {
            if (!this.linkEncuesta) return ''
            return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(this.linkEncuesta)}`
        }
    },

    mounted() {
        this.getEncuestas()
        window.addEventListener('click',  this.onClickFuera)
        window.addEventListener('keydown', this.onKeydown)
        window.addEventListener('scroll', this.onScroll, true)
        window.addEventListener('resize', this.cerrarMenu)
    },

    beforeDestroy() {
        window.removeEventListener('click',  this.onClickFuera)
        window.removeEventListener('keydown', this.onKeydown)
        window.removeEventListener('scroll', this.onScroll, true)
        window.removeEventListener('resize', this.cerrarMenu)
    },

    watch: {
        // Recargar encuestas al cerrar el modal de preguntas
        popupPreguntas(newVal, oldVal) {
            // Si el modal se cierra (cambió de true a false), recargar encuestas
            if (oldVal === true && newVal === false) {
                this.getEncuestas()
            }
        },
        // Recargar encuestas al cerrar el modal de edición
        popupEditar(newVal, oldVal) {
            if (oldVal === true && newVal === false) {
                this.getEncuestas()
            }
        },
        // Recargar encuestas al cerrar el modal de nueva encuesta
        popup(newVal, oldVal) {
            if (oldVal === true && newVal === false) {
                this.getEncuestas()
            }
        }
    },

    methods: {

        toggleMenu(row, event) {
            if (this.selectedRow && this.selectedRow.id === row.id) { this.cerrarMenu(); return }
            const btn  = event.currentTarget
            const rect = btn.getBoundingClientRect()
            const menuW = 244, pad = 8
            const vw = window.innerWidth
            const vh = window.innerHeight
            // horizontal
            let left = rect.right - menuW
            if (left < pad) left = pad
            if (left + menuW > vw - pad) left = vw - menuW - pad
            // vertical: si no cabe abajo, abre arriba
            const spaceBelow = vh - rect.bottom - pad
            const spaceAbove = rect.top - pad
            let top, maxH
            if (spaceBelow >= 180 || spaceBelow >= spaceAbove) {
                top  = rect.bottom + pad
                maxH = spaceBelow
            } else {
                // abre hacia arriba — calculamos después de saber maxH
                maxH = spaceAbove
                top  = rect.top - pad - Math.min(maxH, 380)
                if (top < pad) top = pad
            }
            this.menuPos     = { top, left, maxH: Math.min(maxH, 380) }
            this.selectedRow = row
        },

        cerrarMenu() { this.selectedRow = null },
        onKeydown(e) { if (e.key === 'Escape') this.cerrarMenu() },
        onClickFuera(e) {
            if (!e.target.closest('.menu-trigger-btn') && !e.target.closest('.menu-flotante')) this.cerrarMenu()
        },

        // Al hacer scroll, reposiciona el menú siguiendo el botón que lo abrió
        onScroll() {
            if (!this.selectedRow) return
            // busca el botón trigger de la fila activa
            const btn = document.querySelector('.menu-trigger-btn.active')
            if (!btn) { this.cerrarMenu(); return }
            const rect = btn.getBoundingClientRect()
            // si el botón salió del viewport, cierra
            if (rect.bottom < 0 || rect.top > window.innerHeight) { this.cerrarMenu(); return }
            const menuW = 244, pad = 8
            const vw = window.innerWidth, vh = window.innerHeight
            let left = rect.right - menuW
            if (left < pad) left = pad
            if (left + menuW > vw - pad) left = vw - menuW - pad
            const spaceBelow = vh - rect.bottom - pad
            const spaceAbove = rect.top - pad
            let top, maxH
            if (spaceBelow >= 180 || spaceBelow >= spaceAbove) {
                top = rect.bottom + pad; maxH = spaceBelow
            } else {
                maxH = spaceAbove
                top  = rect.top - pad - Math.min(maxH, 380)
                if (top < pad) top = pad
            }
            this.menuPos = { top, left, maxH: Math.min(maxH, 380) }
        },

        getEncuestas() {
            let me = this
            me.$vs.loading()
            me.$http.get(me.$server_url + 'encuesta_prolipa/')
                .then(res => { me.encuestas = res.data })
                .catch(err => console.log(err))
                .finally(() => { me.$vs.loading.close() })
        },

        abrirModal() {
            this.form = { titulo: '', descripcion: '' }
            this.popup = true
        },

        guardar() {
            let me = this
            if (!me.form.titulo) return me.$vs.notify({ color: 'warning', text: 'El título es obligatorio' })

            me.guardando = true
            me.$http.post(me.$server_url + 'encuesta_prolipa/crear', {
                ...me.form,
                created_by: me.usuarioLogueado ? me.usuarioLogueado.idusuario : null
            })
                .then(res => {
                    if (res.data.status === 0) {
                        me.$vs.notify({ color: 'warning', text: res.data.message })
                        me.guardando = false
                        return
                    }
                    me.popup = false; me.guardando = false
                    me.getEncuestas()
                    me.$vs.notify({ color: 'success', text: 'Encuesta creada correctamente' })
                })
                .catch(err => { me.guardando = false; console.log(err) })
        },

        cambiarEstado(encuesta, estado) {
            this.$http.post(this.$server_url + 'encuesta_prolipa/' + encuesta.id + '/estado', { estado })
                .then(() => this.getEncuestas())
                .catch(err => console.log(err))
        },

        eliminarEncuesta(encuesta) {
            let me = this
            me.$vs.dialog({
                type: 'confirm', color: 'danger',
                title: 'Eliminar encuesta',
                text: `¿Seguro que deseas eliminar "${encuesta.titulo}"?`,
                accept: () => {
                    me.$http.delete(me.$server_url + 'encuesta_prolipa/' + encuesta.id)
                        .then(res => {
                            if (res.data.status === 1) {
                                me.getEncuestas()
                                me.$vs.notify({ color: 'success', text: 'Encuesta eliminada' })
                            } else {
                                me.$vs.notify({ color: 'danger', text: res.data.message })
                            }
                        })
                        .catch(err => console.log(err))
                }
            })
        },

        abrirPreguntas(encuesta)     { this.encuestaSeleccionada = encuesta; this.popupPreguntas = true },
        verLink(encuesta)            { this.encuestaSeleccionada = encuesta; this.popupLink = true },
        abrirEstadisticas(encuesta)  { this.encuestaSeleccionada = encuesta; this.popupEstadisticas = true },
        abrirParticipantes(encuesta) { this.encuestaSeleccionada = encuesta; this.popupParticipantes = true },

        abrirEditar(encuesta) {
            this.formEditar = {
                id:              encuesta.id,
                titulo:          encuesta.titulo,
                descripcion:     encuesta.descripcion || '',
                estado:          encuesta.estado,
                preguntas_count: encuesta.preguntas_count || 0,
            }
            this.popupEditar = true
        },

        guardarEditar() {
            let me = this
            if (!me.formEditar.titulo) return me.$vs.notify({ color: 'warning', text: 'El título es obligatorio' })

            if (me.formEditar.estado === 'habilitada' && me.formEditar.preguntas_count === 0) {
                return me.$vs.notify({ color: 'warning', text: 'No se puede habilitar una encuesta sin preguntas' })
            }

            me.guardando = true
            me.$http.post(me.$server_url + 'encuesta_prolipa/actualizar/' + me.formEditar.id, {
                titulo:      me.formEditar.titulo,
                descripcion: me.formEditar.descripcion,
                estado:      me.formEditar.estado
            })
                .then(res => {
                    if (res.data.status === 0) {
                        me.$vs.notify({ color: 'warning', text: res.data.message })
                        me.guardando = false
                        return
                    }
                    me.popupEditar = false
                    me.guardando   = false
                    me.getEncuestas()
                    me.$vs.notify({ color: 'success', text: 'Encuesta actualizada' })
                })
                .catch(err => { me.guardando = false; console.log(err) })
        },

        copiarLink() {
            navigator.clipboard.writeText(this.linkEncuesta)
            this.$vs.notify({ color: 'success', text: 'Link copiado al portapapeles' })
        },

        abrirLink() {
            window.open(this.linkEncuesta, '_blank')
        },

        previsualizarEncuesta(encuesta) {
            const url = `${window.location.origin}/encuesta/prolipa/${encuesta.codigo}?preview=1`
            window.open(url, '_blank')
        },

        descargarQR() {
            const link = document.createElement('a')
            link.href = this.qrUrl
            link.download = `QR_${this.encuestaSeleccionada.codigo}.png`
            link.target = '_blank'
            link.click()
        }
    }
}
</script>

<style scoped>
/* solo estilos que aplican dentro del componente */
</style>

<style>
.menu-trigger-btn {
    width: 32px; height: 32px; border-radius: 50%;
    border: 2px solid #dde1e7; background: #fff;
    cursor: pointer; display: inline-flex;
    align-items: center; justify-content: center;
    font-size: 20px; color: #666; line-height: 1;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08); user-select: none;
}
.menu-trigger-btn:hover,
.menu-trigger-btn.active {
    border-color: #6c63ff; background: #f3f1ff;
    box-shadow: 0 2px 10px rgba(108,99,255,0.2); color: #6c63ff;
}

.menu-flotante {
    width: 244px; background: #fff; border-radius: 14px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10);
    overflow: hidden; border: 1px solid rgba(0,0,0,0.07);
}
.menu-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px 8px; border-bottom: 1px solid #f0f0f0;
}
.menu-titulo { font-weight: 700; font-size: 12px; color: #1a1a2e; letter-spacing: 0.6px; text-transform: uppercase; }
.menu-cerrar {
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: #999; padding: 2px 6px; border-radius: 50%;
    transition: background 0.15s, color 0.15s;
}
.menu-cerrar:hover { background: #f0f0f0; color: #333; }
.menu-codigo { font-size: 10px; color: #888; padding: 4px 16px 10px; font-family: monospace; letter-spacing: 0.5px; }
.menu-items  { padding: 4px 8px 10px; display: flex; flex-direction: column; gap: 4px; }

.menu-item {
    display: flex; align-items: center; gap: 12px; width: 100%;
    padding: 10px; border: none; border-radius: 10px;
    cursor: pointer; background: transparent; text-align: left;
    transition: background 0.15s, transform 0.1s;
}
.menu-item:hover  { transform: translateX(2px); }
.menu-item:active { transform: scale(0.98); }
.menu-item-icono {
    width: 34px; height: 34px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 16px;
}
.menu-item-texto { display: flex; flex-direction: column; gap: 1px; }
.menu-item-texto strong { font-size: 13px; font-weight: 600; line-height: 1.2; }
.menu-item-texto small  { font-size: 10.5px; opacity: 0.7; }

/* Preguntas — naranja */
.menu-item--preguntas:hover                   { background: #fff3e0; }
.menu-item--preguntas .menu-item-icono        { background: #ffecd0; color: #d35400; }
.menu-item--preguntas .menu-item-texto strong { color: #c0490a; }
.menu-item--preguntas .menu-item-texto small  { color: #e67e22; }

/* Editar — azul índigo */
.menu-item--editar:hover                   { background: #eef2ff; }
.menu-item--editar .menu-item-icono        { background: #e0e7ff; color: #4338ca; }
.menu-item--editar .menu-item-texto strong { color: #3730a3; }
.menu-item--editar .menu-item-texto small  { color: #6366f1; }

/* Activar — verde */
.menu-item--activar:hover                   { background: #e8f8f0; }
.menu-item--activar .menu-item-icono        { background: #e0f5ea; color: #1a8a50; }
.menu-item--activar .menu-item-texto strong { color: #1a7a45; }
.menu-item--activar .menu-item-texto small  { color: #2ecc71; }

/* Cerrar — rojo suave */
.menu-item--cerrar:hover                   { background: #fff0f0; }
.menu-item--cerrar .menu-item-icono        { background: #fde8e6; color: #c0392b; }
.menu-item--cerrar .menu-item-texto strong { color: #b03025; }
.menu-item--cerrar .menu-item-texto small  { color: #e74c3c; }

/* Link — azul */
.menu-item--link:hover                   { background: #eff6ff; }
.menu-item--link .menu-item-icono        { background: #dbeafe; color: #0055cc; }
.menu-item--link .menu-item-texto strong { color: #0055cc; }
.menu-item--link .menu-item-texto small  { color: #3b82f6; }

/* Preview — verde azulado */
.menu-item--preview:hover                   { background: #f0fdfa; }
.menu-item--preview .menu-item-icono        { background: #ccfbf1; color: #0f766e; }
.menu-item--preview .menu-item-texto strong { color: #0f766e; }
.menu-item--preview .menu-item-texto small  { color: #14b8a6; }

/* QR — morado */
.menu-item--qr:hover                   { background: #f5f3ff; }
.menu-item--qr .menu-item-icono        { background: #ede9fe; color: #6c63ff; }
.menu-item--qr .menu-item-texto strong { color: #5b21b6; }
.menu-item--qr .menu-item-texto small  { color: #7c3aed; }

/* Eliminar — rojo */
.menu-item--eliminar:hover                   { background: #fdecea; }
.menu-item--eliminar .menu-item-icono        { background: #fde8e6; color: #c0392b; }
.menu-item--eliminar .menu-item-texto strong { color: #b03025; }
.menu-item--eliminar .menu-item-texto small  { color: #e74c3c; }

/* Estadísticas — verde azulado */
.menu-item--estadisticas:hover                   { background: #ecfdf5; }
.menu-item--estadisticas .menu-item-icono        { background: #d1fae5; color: #059669; }
.menu-item--estadisticas .menu-item-texto strong { color: #047857; }
.menu-item--estadisticas .menu-item-texto small  { color: #10b981; }

/* Participantes — azul cielo */
.menu-item--participantes:hover                   { background: #f0f9ff; }
.menu-item--participantes .menu-item-icono        { background: #e0f2fe; color: #0284c7; }
.menu-item--participantes .menu-item-texto strong { color: #0369a1; }
.menu-item--participantes .menu-item-texto small  { color: #38bdf8; }

.menu-slide-enter-active, .menu-slide-leave-active {
    transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.menu-slide-enter, .menu-slide-leave-to {
    opacity: 0; transform: translateY(-8px) scale(0.96);
}

/* Botón Refresh */
.refresh-btn {
    width: 32px; height: 32px; border-radius: 50%;
    border: 2px solid #e0e7ff; background: #f5f7ff;
    cursor: pointer; display: inline-flex;
    align-items: center; justify-content: center;
    font-size: 14px; color: #6c63ff;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    flex-shrink: 0;
    padding: 0;
    outline: none;
}
.refresh-btn:hover {
    background: #6c63ff;
    color: #fff;
    border-color: #6c63ff;
}
.refresh-btn:active {
    transform: scale(0.95);
}
.refresh-btn.loading i {
    animation: spin 1s linear infinite;
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
