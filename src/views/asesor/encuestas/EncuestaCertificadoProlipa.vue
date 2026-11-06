<template>
  <div class="pagina-certificado" :class="{ 'pagina-certificado--preview': previewMode }">

    <p v-if="previewMode" class="preview-admin-aviso">
      Vista previa administrativa — el nombre del participante es solo un ejemplo.
    </p>

    <div
      v-if="certificadoListo"
      id="seccionImprimir2"
      class="contenedor-cert"
      :class="{ 'contenedor-cert-director': esModoDirector }"
    >
      <img :src="fondoDiplomaSrc" class="diploma-bg" alt="Diploma">

      <!-- Contenedor central de referencia -->
      <div class="contenido-central" :class="claseTamanoNombre">

        <!-- Nombre del participante -->
        <div class="nombre-participante" :class="claseTamanoNombre">
          <span class="a-prefijo">A:</span> {{ titlecase(usuario.nombres) }} {{ titlecase(usuario.apellidos) }}
        </div>

        <!-- Texto "Por su exitosa participación en:" -->
        <div class="texto-exitoso">
          Por su exitosa participación en:
        </div>

        <!-- Título de la capacitación -->
        <div class="titulo-capacitacion">
          {{ titlecase(nombreCapacitacion || encuesta.titulo) }}
        </div>

        <!-- Duración y fecha -->
        <div class="duracion-certificado">
          Con una duración de: {{ horasCapacitacion }} horas
        </div>
        <div class="fecha-certificado">
          {{ fechaMostrar }}
        </div>

      </div>

      <!-- Firma electrónica (capacitador o director editorial) -->
      <div
        v-if="tipoFirma === 'p12' && nombreCapacitador"
        :class="[
          'firma-container',
          'firma-electronica-container',
          esModoDirector ? 'firma-director' : '',
          esModoDirector && claseTamanoNombre ? claseTamanoNombre : ''
        ]"
      >
        <div class="firma-ec-inner">
          <img
            v-if="qrFirmaSrc"
            :src="qrFirmaSrc"
            class="firma-ec-qr"
            alt="QR firma electrónica"
          />
          <div class="firma-ec-texto">
            <span
              v-for="(linea, idx) in nombreLineasFirma"
              :key="'firma-linea-' + idx"
              class="firma-ec-nombre"
            >{{ linea }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="!esModoDirector && tipoFirma === 'imagen' && firmaCapacitador" class="firma-container">
        <img
          ref="firmaImg"
          :src="$data_url + 'archivos/usuarios/firmas/' + firmaCapacitador"
          alt="Firma Capacitador"
          class="firma-img"
          @load="recortarFirmaBlanca"
        >
      </div>
    </div>

    <vs-popup v-if="!previewMode" title="Sigue estos pasos para descargar tu certificado" :active.sync="popupActivo">
      <div class="popup-descarga-cert">
        <img src="../../../assets/images/seminarios/tutorialDescarga.png" class="tutorial-descarga-img">
        <vs-button color="primary" class="btn-descargar-cert" type="gradient" :disabled="firmando" @click="descargarCertificado()">
          {{ firmando ? 'Generando certificado...' : 'Descargar' }}
        </vs-button>
        <p v-if="errorMsg" class="error-descarga-cert">{{ errorMsg }}</p>
      </div>
    </vs-popup>

  </div>
</template>

<script>
export default {
  props: {
    previewMode: { type: Boolean, default: false },
    previewAsignacionId: { type: [Number, String], default: null },
    previewEncuesta: { type: Object, default: null },
    previewNombreEntidad: { type: String, default: '' },
    previewUsuarioEjemplo: {
      type: Object,
      default: () => ({ nombres: 'Juan Carlos', apellidos: 'Pérez González' })
    }
  },

  data() {
    return {
      popupActivo: false,
      usuario: { nombres: '', apellidos: '' },
      encuesta: { titulo: '', codigo: '' },
      nombreCapacitacion: '',
      firmaCapacitador: null,
      nombreCapacitador: null,
      idusuarioCapacitador: null,
      modoCertificado: 'capacitador',
      firmaCapacitadorModo: 0,
      tipoFirma: 'ninguna',
      fechaFin: '',
      horasCapacitacion: 6,
      firmando: false,
      errorMsg: '',
      certificadoListo: false
    }
  },
  computed: {
    fechaHoy() {
      const d = new Date()
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dia = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${dia}`
    },
    esModoDirector() {
      return this.modoCertificado === 'director' || this.firmaCapacitadorModo === 1
    },
    fondoDiplomaSrc() {
      if (this.esModoDirector) {
        return require('@/assets/images/seminarios/diploma_director.png')
      }
      return require('@/assets/images/seminarios/diploma2.jpg')
    },
    fechaMostrar() {
      if (this.fechaFin) return String(this.fechaFin).split(/[ T]/)[0]
      return this.fechaHoy
    },
    claseTamanoNombre() {
      const nombre = `${this.usuario.nombres || ''} ${this.usuario.apellidos || ''}`.trim()
      const palabras = nombre ? nombre.split(/\s+/).length : 0
      if (nombre.length > 40 || palabras >= 5) return 'nombre-muy-largo'
      if (nombre.length > 22 || palabras >= 4) return 'nombre-largo'
      return ''
    },
    nombreLineasFirma() {
      return this.dividirNombreFirmaEc(this.nombreCapacitador)
    },
    qrFirmaSrc() {
      if (this.tipoFirma !== 'p12' || !this.nombreCapacitador) {
        return ''
      }
      const payload = this.construirPayloadQrFirmaEc(
        this.nombreCapacitador,
        'Certificado de participación Prolipa'
      )
      return 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data='
        + encodeURIComponent(payload)
    }
  },
  mounted() {
    if (this.previewMode) {
      this.usuario = { ...this.previewUsuarioEjemplo }
      this.encuesta = this.previewEncuesta
        ? { ...this.previewEncuesta }
        : { titulo: 'Encuesta', codigo: 'PREVIEW' }
      this.nombreCapacitacion = this.previewNombreEntidad || ''
      this.cargarDatosCertificado()
      return
    }

    try {
      const u = localStorage.getItem('userEncuestaProlipa')
      const e = localStorage.getItem('dataEncuestaCertificado')
      const n = localStorage.getItem('nombreEntidadEncuesta')
      const ff = localStorage.getItem('fechaFinEncuesta')
      if (u) this.usuario = JSON.parse(u)
      if (e) this.encuesta = JSON.parse(e)
      if (n) this.nombreCapacitacion = n
      if (ff) this.fechaFin = ff
    } catch (err) { }
    this.cargarDatosCertificado()
    this.valPopupDesc()
  },
  methods: {
    titlecase(value) {
      if (!value) return '';
      return value.toLowerCase().replace(/(?:^|\s)\S/g, function(char) {
        return char.toUpperCase();
      });
    },
    dividirNombreFirmaEc(nombre) {
      const titular = String(nombre || '').trim().toUpperCase()
      if (!titular) return []
      const partes = titular.split(/\s+/).filter(Boolean)
      if (partes.length <= 2) return [titular]
      const mitad = Math.ceil(partes.length / 2)
      return [
        partes.slice(0, mitad).join(' '),
        partes.slice(mitad).join(' ')
      ]
    },
    formatearFechaIsoFirmaEc(date) {
      const d = date || new Date()
      const pad = (n, len) => String(n).padStart(len, '0')
      const y = d.getFullYear()
      const m = pad(d.getMonth() + 1, 2)
      const day = pad(d.getDate(), 2)
      const h = pad(d.getHours(), 2)
      const min = pad(d.getMinutes(), 2)
      const s = pad(d.getSeconds(), 2)
      const ms = pad(d.getMilliseconds(), 3)
      return `${y}-${m}-${day}T${h}:${min}:${s}.${ms}000000-05:00`
    },
    construirPayloadQrFirmaEc(nombre, motivo) {
      const titular = String(nombre || '').trim().toUpperCase()
      return [
        'FIRMADO POR: ' + titular,
        'RAZON: ' + String(motivo || '').trim(),
        'LOCALIZACION:',
        'FECHA: ' + this.formatearFechaIsoFirmaEc(new Date()),
        'VALIDAR CON: https://www.firmadigital.gob.ec',
        'Firmado digitalmente con Prolipa'
      ].join('\n')
    },
    aplicarDatosCapacitador(data) {
      if (!data) return

      this.firmaCapacitadorModo = data.firma_capacitador != null
        ? parseInt(data.firma_capacitador, 10) || 0
        : 0
      this.modoCertificado = data.modo_certificado
        || (this.firmaCapacitadorModo === 1 ? 'director' : 'capacitador')
      this.tipoFirma = data.tipo_firma || 'ninguna'
      this.nombreCapacitador = data.nombre_firmante || data.nombre_capacitador || null
      this.idusuarioCapacitador = data.idusuario_firmante || data.idusuario_capacitador || null
      this.firmaCapacitador = (!this.esModoDirector && data.tipo_firma === 'imagen')
        ? (data.firma_capacitador || null)
        : null

      if (this.previewMode) return

      localStorage.setItem('tipoFirmaCapacitadorEncuesta', this.tipoFirma)
      localStorage.setItem('modoCertificadoEncuesta', this.modoCertificado)
      localStorage.setItem('firmaCapacitadorModoEncuesta', String(this.firmaCapacitadorModo))
      if (this.nombreCapacitador) {
        localStorage.setItem('nombreCapacitadorEncuesta', this.nombreCapacitador)
      } else {
        localStorage.removeItem('nombreCapacitadorEncuesta')
      }
      if (this.idusuarioCapacitador) {
        localStorage.setItem('idusuarioCapacitadorEncuesta', String(this.idusuarioCapacitador))
      } else {
        localStorage.removeItem('idusuarioCapacitadorEncuesta')
      }
      if (this.firmaCapacitador) {
        localStorage.setItem('firmaCapacitadorEncuesta', this.firmaCapacitador)
      } else {
        localStorage.removeItem('firmaCapacitadorEncuesta')
      }
    },
    cargarDatosCertificado() {
      const asignacionId = this.previewMode
        ? this.previewAsignacionId
        : localStorage.getItem('asignacionIdEncuesta')

      if (!asignacionId) {
        this.certificadoListo = true
        return
      }

      this.$http.get(this.$server_url + 'encuesta_prolipa/asignaciones/' + asignacionId + '/datos-certificado')
        .then(res => {
          const data = res.data
          if (data.fecha_fin) {
            this.fechaFin = String(data.fecha_fin).split(/[ T]/)[0]
            if (!this.previewMode) {
              localStorage.setItem('fechaFinEncuesta', this.fechaFin)
            }
          }
          if (!this.nombreCapacitacion && data.nombre_entidad) {
            this.nombreCapacitacion = data.nombre_entidad
            if (!this.previewMode) {
              localStorage.setItem('nombreEntidadEncuesta', data.nombre_entidad)
            }
          }
          if (data.horas_capacitacion != null && data.horas_capacitacion !== '') {
            this.horasCapacitacion = parseInt(data.horas_capacitacion, 10) || 6
          } else {
            this.horasCapacitacion = 6
          }
          this.aplicarDatosCapacitador(data)
        })
        .catch(() => { })
        .finally(() => {
          this.certificadoListo = true
        })
    },
    valPopupDesc() {
      setTimeout(() => {
        if (!this.popupActivo) {
          this.popupActivo = true
        }
      }, 3000)
    },
    descargarCertificado() {
      this.popupActivo = false
      this.errorMsg = ''
      const nombreArchivo = 'certificado_' + (this.encuesta.codigo || 'encuesta').replace('ENC_', 'CAP_')
      document.title = nombreArchivo

      try {
        const payload = {
          encuesta_id: this.encuesta.id,
          usuario_id: this.usuario.idusuario,
        }
        const asignacionId = localStorage.getItem('asignacionIdEncuesta')
        if (asignacionId) payload.asignacion_id = asignacionId

        this.$http.post(this.$server_url + 'encuesta_prolipa/registrar-descarga', payload)
          .catch(() => { })
      } catch (e) { }

      if (this.tipoFirma === 'p12' && this.idusuarioCapacitador) {
        this.descargarCertificadoFirmado(nombreArchivo)
        return
      }

      setTimeout(() => {
        window.print()
      }, 1000)
    },
    async descargarCertificadoFirmado(nombreArchivo) {
      const participanteNombre = `${this.titlecase(this.usuario.nombres)} ${this.titlecase(this.usuario.apellidos)}`.trim()

      this.firmando = true
      this.errorMsg = ''
      this.$vs.loading({ color: '#046AE7' })

      try {
        const response = await this.$http.post(
          this.$server_url + 'api/encuesta_prolipa/firmar-certificado',
          {
            idusuario: this.idusuarioCapacitador,
            participante_nombre: participanteNombre,
            capacitacion_nombre: this.titlecase(this.nombreCapacitacion || this.encuesta.titulo),
            fecha: this.fechaMostrar,
            horas_capacitacion: this.horasCapacitacion || 6,
            motivo: 'Certificado de participación Prolipa',
          },
          { responseType: 'blob' }
        )

        const contentType = (response.headers && response.headers['content-type']) || ''
        if (contentType.indexOf('application/pdf') === -1) {
          const texto = await response.data.text()
          try {
            const json = JSON.parse(texto)
            this.errorMsg = json.message || 'No se pudo generar el certificado firmado.'
          } catch (err) {
            this.errorMsg = 'No se pudo generar el certificado firmado.'
          }
          this.popupActivo = true
          return
        }

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = nombreArchivo + '.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(url), 1000)

        this.$vs.notify({
          text: 'Certificado firmado electrónicamente descargado',
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check',
        })
      } catch (error) {
        let mensaje = 'Error al firmar el certificado.'
        if (error.response && error.response.data instanceof Blob) {
          const texto = await error.response.data.text()
          try {
            const json = JSON.parse(texto)
            mensaje = json.message || mensaje
          } catch (err) { /* mantener mensaje por defecto */ }
        } else if (error.response && error.response.data && error.response.data.message) {
          mensaje = error.response.data.message
        }
        this.errorMsg = mensaje
        this.popupActivo = true
        this.$vs.notify({
          text: mensaje,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
        })
      } finally {
        this.firmando = false
        this.$vs.loading.close()
      }
    },
    recortarFirmaBlanca(event) {
      const img = event.target
      if (!img || !img.naturalWidth) return

      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)

        const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const umbral = 245
        let top = height
        let left = width
        let right = 0
        let bottom = 0

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const a = data[i + 3]
            const esBlanco = a < 12 || (r >= umbral && g >= umbral && b >= umbral)
            if (!esBlanco) {
              if (x < left) left = x
              if (x > right) right = x
              if (y < top) top = y
              if (y > bottom) bottom = y
            }
          }
        }

        if (right <= left || bottom <= top) return

        const cropW = right - left + 1
        const cropH = bottom - top + 1
        const recortado = document.createElement('canvas')
        recortado.width = cropW
        recortado.height = cropH
        recortado.getContext('2d').drawImage(canvas, left, top, cropW, cropH, 0, 0, cropW, cropH)
        img.src = recortado.toDataURL('image/png')
      } catch (err) {
        // Si CORS bloquea el canvas, mix-blend-mode en CSS hace el efecto visual
      }
    }
  }
}
</script>

<style>
@font-face {
  font-family: "font_diploma";
  src: url("../../../assets/images/seminarios/SavoyePlain.otf");
}

/* Estilos base */
.pagina-certificado {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
}

.pagina-certificado--preview {
  min-height: auto;
  background: transparent;
  padding: 0.5rem 0 1rem;
}

.preview-admin-aviso {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px;
  max-width: 900px;
  padding: 0 12px;
}

.popup-descarga-cert {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tutorial-descarga-img {
  width: 100%;
  display: block;
}

.btn-descargar-cert {
  width: 100%;
}

.contenedor-cert {
  position: relative;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.diploma-bg {
  width: 100%;
  height: auto;
  max-width: 1280px;
  display: block;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Contenedor central de referencia */
.contenido-central {
  position: absolute;
  top: 57%;
  left: 48%;
  transform: translate(-50%, -50%);
  width: 72%;
  max-width: 900px;
  text-align: center;
  padding: 0 10% 0 6%;
  box-sizing: border-box;
}

/* Nombre del participante */
.nombre-participante {
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: clamp(18px, 4vw, 48px);
  text-align: center;
  white-space: normal;
  word-wrap: break-word;
  margin-top: -1.15cm;
  margin-left: -1.2cm;
  margin-bottom: 16px;
  color: #2c3e50;
  line-height: 1.3;
}

.contenido-central.nombre-largo {
  top: 58.5%;
  transform: translate(-50%, -47%);
  padding: 0 16% 0 6%;
}

.nombre-participante.nombre-largo {
  margin-top: 0.35cm;
  margin-bottom: 14px;
  line-height: 1.1;
  font-size: clamp(17px, 3.6vw, 42px);
}

.nombre-participante.nombre-muy-largo {
  font-size: clamp(15px, 3.2vw, 36px);
  margin-top: 0.5cm;
  line-height: 1.1;
}

.a-prefijo {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
}

/* Texto "Por su exitosa participación en:" */
.texto-exitoso {
  font-family: 'font_diploma', cursive;
  font-weight: 700;
  line-height: 1.2;
  font-size: clamp(16px, 3vw, 38px);
  text-align: center;
  margin-bottom: 15px;
  color: #1a1a1a;
  word-wrap: break-word;
}

/* Título de la capacitación */
.titulo-capacitacion {
  font-family: 'font_diploma', cursive;
  line-height: 1.3;
  font-size: clamp(14px, 2.8vw, 48px);
  text-align: center;
  word-wrap: break-word;
  color: #1a1a1a;
  padding: 0 10px 0 10px;
  margin-bottom: 10px;
  padding-right: 12%;
  padding-left: 8%;
  box-sizing: border-box;
}

/* Duración y fecha del certificado */
.duracion-certificado {
  font-family: 'font_diploma', cursive;
  font-weight: 600;
  font-style: italic;
  text-align: center;
  color: #1a1a1a;
  margin-top: -6px;
  margin-bottom: 0;
  font-size: clamp(12px, 2.1vw, 24px);
  line-height: 1.2;
}

.fecha-certificado {
  font-family: 'font_diploma', cursive;
  font-weight: 600;
  text-align: center;
  color: #1a1a1a;
  margin-top: 2px;
  font-size: clamp(11px, 1.9vw, 22px);
  line-height: 1.2;
  white-space: nowrap;
}

/* Contenedor de la firma - anclado justo sobre la línea "Capacitador" */
.firma-container {
  position: absolute;
  top: 87%;
  left: 63%;
  transform: translate(-50%, -100%);
  width: 14%;
  min-width: 60px;
  max-width: 180px;
  height: auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.firma-img {
  max-width: 100%;
  max-height: 80px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  mix-blend-mode: multiply;
}

.firma-electronica-container {
  align-items: flex-end;
  transform: translate(-50%, -106%);
  width: auto;
  min-width: 130px;
  max-width: 220px;
}

.firma-ec-inner {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 4px;
}

.firma-ec-qr {
  width: clamp(38px, 5.5vw, 58px);
  height: clamp(38px, 5.5vw, 58px);
  flex-shrink: 0;
  display: block;
}

.firma-ec-texto {
  text-align: left;
  line-height: 1.15;
  color: #111;
  font-family: 'Courier New', Courier, monospace;
}

.firma-ec-nombre {
  display: block;
  font-size: clamp(6px, 0.95vw, 10px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  margin-top: 1px;
}

/* Modo Director Editorial (diploma_director.png) */
.contenedor-cert-director .contenido-central {
  top: 54%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 8%;
  width: 78%;
}

.contenedor-cert-director .nombre-participante {
  margin-left: -3cm;
  margin-top: 1cm;
}

.contenedor-cert-director .texto-exitoso,
.contenedor-cert-director .titulo-capacitacion,
.contenedor-cert-director .duracion-certificado,
.contenedor-cert-director .fecha-certificado {
  margin-left: -3cm;
}

.contenedor-cert-director .titulo-capacitacion {
  margin-bottom: 2px;
}

.contenedor-cert-director .duracion-certificado {
  margin-top: -10px;
  font-size: clamp(13px, 2.3vw, 26px);
}

.contenedor-cert-director .fecha-certificado {
  margin-top: 0;
  font-size: clamp(12px, 2.1vw, 24px);
}

/* Nombres largos: bajar el bloque para no pegarse a "Certificado" (diploma director) */
.contenedor-cert-director .contenido-central.nombre-largo {
  top: 56%;
  transform: translate(-50%, -45%);
  padding: 0 10% 0 6%;
}

.contenedor-cert-director .contenido-central.nombre-muy-largo {
  top: 57%;
  transform: translate(-50%, -42%);
  padding: 0 12% 0 6%;
}

.contenedor-cert-director .nombre-participante.nombre-largo {
  margin-top: 0.7cm;
  margin-bottom: 14px;
}

.contenedor-cert-director .nombre-participante.nombre-muy-largo {
  margin-top: 0.5cm;
  margin-bottom: 12px;
}

.firma-director,
.contenedor-cert-director .firma-container.firma-electronica-container {
  top: 83% !important;
  bottom: auto !important;
  left: 50% !important;
  transform: translate(-50%, calc(-100% + 0.5cm)) !important;
  width: auto;
  min-width: 140px;
  max-width: 220px;
}

.error-descarga-cert {
  color: #e53e3e;
  font-size: 13px;
  margin: 0;
  text-align: center;
}

/* Configuración de impresión - horizontal, anclada a la imagen del diploma */
@page {
  size: letter landscape;
  margin: 0;
}

@media print {
  @page {
    size: letter landscape;
    margin: 0;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body, html {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: white !important;
    overflow: hidden !important;
  }

  /* Solo imprimir el certificado (evita cortes en Chrome Android) */
  body * {
    visibility: hidden;
  }

  .pagina-certificado,
  .pagina-certificado * {
    visibility: visible;
  }

  .pagina-certificado {
    position: fixed;
    left: 0;
    top: 0;
    width: 100% !important;
    height: 100% !important;
    min-height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    display: block !important;
    background: white !important;
    overflow: hidden !important;
  }

  .contenedor-cert {
    position: relative !important;
    width: 100% !important;
    max-width: none !important;
    height: 100% !important;
    min-height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    background: white !important;
    display: block !important;
    overflow: hidden !important;
  }

  .diploma-bg {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    display: block !important;
    margin: 0 !important;
    box-shadow: none !important;
    object-fit: fill !important;
    page-break-inside: avoid !important;
  }

  .contenido-central {
    top: 57%;
    left: 48%;
    width: 72%;
    padding: 0 10% 0 6%;
  }

  .nombre-participante {
    font-size: 28px;
    margin-top: -1.15cm;
    margin-left: -1.2cm;
    margin-bottom: 14px;
  }

  .contenido-central.nombre-largo {
    top: 58.5%;
    padding: 0 16% 0 6%;
  }

  .nombre-participante.nombre-largo {
    margin-top: 0.35cm;
    margin-bottom: 12px;
  }

  .nombre-participante.nombre-muy-largo {
    font-size: 24px;
    margin-top: 0.45cm;
  }

  .texto-exitoso {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .titulo-capacitacion {
    font-size: 34px;
    margin-bottom: 4px;
  }

  .duracion-certificado {
    font-size: 18px;
    margin-top: -6px;
  }

  .fecha-certificado {
    font-size: 17px;
    margin-top: 2px;
  }

  .firma-container {
    top: 87%;
    left: 63%;
    transform: translate(-50%, -100%);
    width: 14%;
    max-width: 180px;
  }

  .contenedor-cert-director .contenido-central {
    top: 54%;
    left: 50%;
    width: 78%;
    padding: 0 8%;
  }

  .contenedor-cert-director .nombre-participante {
    margin-left: -3cm;
    margin-top: 1cm;
  }

  .contenedor-cert-director .texto-exitoso,
  .contenedor-cert-director .titulo-capacitacion,
  .contenedor-cert-director .duracion-certificado,
  .contenedor-cert-director .fecha-certificado {
    margin-left: -3cm;
  }

  .contenedor-cert-director .contenido-central.nombre-largo {
    top: 56%;
    transform: translate(-50%, -45%);
  }

  .contenedor-cert-director .contenido-central.nombre-muy-largo {
    top: 57%;
    transform: translate(-50%, -42%);
  }

  .contenedor-cert-director .nombre-participante.nombre-largo {
    margin-top: 0.7cm;
    margin-bottom: 14px;
  }

  .contenedor-cert-director .nombre-participante.nombre-muy-largo {
    margin-top: 0.5cm;
    margin-bottom: 12px;
  }

  .firma-director,
  .contenedor-cert-director .firma-container.firma-electronica-container {
    top: 83% !important;
    bottom: auto !important;
    left: 50% !important;
    transform: translate(-50%, calc(-100% + 0.5cm)) !important;
    width: auto !important;
    max-width: 220px !important;
  }

  .firma-img {
    max-height: 80px;
  }

  .vs-popup--background,
  .vs-popup--content {
    display: none !important;
  }
}

/* Responsive para tablets */
@media screen and (max-width: 1024px) and (min-width: 768px) {
  .contenido-central {
    top: 58%;
    width: 74%;
    padding: 0 10% 0 6%;
  }

  .nombre-participante {
    margin-bottom: 12px;
  }

  .texto-exitoso {
    margin-bottom: 8px;
  }

  .titulo-capacitacion {
    margin-bottom: 6px;
  }

  .duracion-certificado {
    margin-top: -4px;
    font-size: clamp(11px, 2vw, 16px);
  }

  .fecha-certificado {
    margin-top: 2px;
    font-size: clamp(10px, 1.8vw, 15px);
  }

  .firma-container {
    top: 87%;
    left: 62.5%;
    width: 15%;
    max-width: 150px;
  }
}

/* Responsive para móviles */
@media screen and (max-width: 767px) {
  .pagina-certificado {
    min-height: auto;
    align-items: flex-start;
    padding: 8px 0 16px;
  }

  .contenido-central {
    top: 55%;
    left: 48%;
    transform: translate(-50%, -50%);
    width: 78%;
    padding: 0 12% 0 8%;
  }

  .nombre-participante {
    font-size: clamp(11px, 3.1vw, 16px);
    margin-top: -0.35cm;
    margin-left: 0;
    margin-bottom: 6px;
    padding: 0 3%;
    line-height: 1.15;
  }

  .contenido-central.nombre-largo {
    top: 56.5%;
    transform: translate(-50%, -48%);
    padding: 0 14% 0 8%;
  }

  .nombre-participante.nombre-largo {
    font-size: clamp(10px, 2.8vw, 14px);
    margin-top: 0.12cm;
    margin-bottom: 5px;
    line-height: 1.1;
  }

  .nombre-participante.nombre-muy-largo {
    font-size: clamp(9px, 2.5vw, 12px);
    margin-top: 0.2cm;
    line-height: 1.1;
  }

  .texto-exitoso {
    font-size: clamp(12px, 3.2vw, 18px);
    margin-bottom: 5px;
  }

  .titulo-capacitacion {
    font-size: clamp(11px, 2.8vw, 16px);
    margin-bottom: 2px;
    line-height: 1.25;
  }

  .duracion-certificado {
    font-size: clamp(10px, 2.4vw, 14px);
    margin-top: -4px;
    margin-bottom: 0;
  }

  .fecha-certificado {
    font-size: clamp(9px, 2.2vw, 13px);
    margin-top: 1px;
    margin-bottom: 2px;
  }

  .firma-container {
    top: 86.5%;
    left: 62%;
    width: 18%;
    max-width: 90px;
  }

  .firma-electronica-container {
    top: 87.5%;
    left: 66%;
    transform: translate(-50%, -112%);
    width: auto;
    min-width: 95px;
    max-width: 125px;
  }

  .firma-ec-qr {
    width: clamp(30px, 8.5vw, 42px);
    height: clamp(30px, 8.5vw, 42px);
  }

  .firma-ec-nombre {
    font-size: clamp(5px, 1.5vw, 7px);
  }

  .contenedor-cert-director .firma-container.firma-electronica-container {
    top: 79.5% !important;
    bottom: auto !important;
    left: 56% !important;
    transform: translate(calc(-50% - 0.5cm), calc(-100% + 0.75cm)) !important;
    min-width: 95px;
    max-width: 125px;
  }

  .contenedor-cert-director .duracion-certificado,
  .contenedor-cert-director .fecha-certificado {
    font-size: clamp(9px, 2.2vw, 13px);
    margin-top: -3px;
    margin-bottom: 4px;
  }

  .contenedor-cert-director .fecha-certificado {
    margin-top: 0;
  }

  .contenedor-cert-director .contenido-central {
    left: 50%;
    padding: 0 10% 0 10%;
  }

  .contenedor-cert-director .contenido-central.nombre-largo {
    top: 55.5%;
    transform: translate(-50%, -48%);
    padding: 0 10% 0 10%;
  }

  .contenedor-cert-director .contenido-central.nombre-muy-largo {
    top: 56%;
    transform: translate(-50%, -46%);
    padding: 0 10% 0 10%;
  }

  .contenedor-cert-director .contenido-central.nombre-largo .texto-exitoso,
  .contenedor-cert-director .contenido-central.nombre-muy-largo .texto-exitoso {
    margin-bottom: 3px;
  }

  .contenedor-cert-director .contenido-central.nombre-largo .titulo-capacitacion,
  .contenedor-cert-director .contenido-central.nombre-muy-largo .titulo-capacitacion {
    margin-bottom: 1px;
  }

  .contenedor-cert-director .nombre-participante.nombre-largo {
    margin-top: 0.4cm;
    margin-bottom: 10px;
  }

  .contenedor-cert-director .nombre-participante.nombre-muy-largo {
    margin-top: 0.25cm;
    margin-bottom: 8px;
  }

  .contenedor-cert-director .nombre-participante:not(.nombre-largo):not(.nombre-muy-largo) {
    margin-top: 0.75cm;
    margin-left: -1cm;
  }

  .contenedor-cert-director .nombre-participante.nombre-largo,
  .contenedor-cert-director .nombre-participante.nombre-muy-largo {
    margin-left: -1cm;
  }

  .contenedor-cert-director .texto-exitoso,
  .contenedor-cert-director .titulo-capacitacion,
  .contenedor-cert-director .duracion-certificado,
  .contenedor-cert-director .fecha-certificado {
    margin-left: -1cm;
  }

  .contenedor-cert-director .titulo-capacitacion {
    padding-left: 4%;
    padding-right: 4%;
  }

  .contenedor-cert-director .firma-director.nombre-largo.firma-electronica-container,
  .contenedor-cert-director .firma-director.nombre-muy-largo.firma-electronica-container {
    top: 77.5% !important;
    left: 56% !important;
    transform: translate(calc(-50% - 0.5cm), calc(-100% + 0.7cm)) !important;
  }

  .contenedor-cert-director .firma-ec-qr {
    position: relative;
    top: -6px;
    left: 10px;
  }

  .firma-img {
    max-height: 32px;
  }
}

/* Responsive para móviles pequeños */
@media screen and (max-width: 480px) {
  .contenido-central {
    top: 54.5%;
    transform: translate(-50%, -50%);
    width: 82%;
    padding: 0 12% 0 8%;
  }

  .nombre-participante {
    font-size: clamp(10px, 2.9vw, 14px);
    margin-top: -0.25cm;
    margin-left: 0;
    margin-bottom: 4px;
    padding: 0 4%;
  }

  .contenido-central.nombre-largo {
    top: 56%;
    transform: translate(-50%, -47%);
    padding: 0 14% 0 8%;
  }

  .nombre-participante.nombre-largo {
    font-size: clamp(9px, 2.6vw, 12px);
    margin-top: 0.1cm;
    margin-bottom: 4px;
    line-height: 1.1;
  }

  .nombre-participante.nombre-muy-largo {
    font-size: clamp(8px, 2.4vw, 11px);
    margin-top: 0.15cm;
    line-height: 1.1;
  }

  .texto-exitoso {
    margin-bottom: 4px;
  }

  .titulo-capacitacion {
    margin-bottom: 2px;
  }

  .duracion-certificado {
    margin-top: -3px;
  }

  .fecha-certificado {
    margin-top: 1px;
    margin-bottom: 3px;
  }

  .firma-container {
    top: 86%;
    left: 61.5%;
    width: 20%;
    max-width: 70px;
  }

  .firma-electronica-container {
    top: 88%;
    left: 67%;
    transform: translate(-50%, -112%);
    min-width: 88px;
    max-width: 115px;
  }

  .firma-ec-qr {
    width: clamp(28px, 8vw, 38px);
    height: clamp(28px, 8vw, 38px);
  }

  .firma-ec-nombre {
    font-size: clamp(4.5px, 1.4vw, 6.5px);
  }

  .contenedor-cert-director .firma-container.firma-electronica-container {
    top: 78.5% !important;
    bottom: auto !important;
    left: 57% !important;
    transform: translate(calc(-50% - 0.5cm), calc(-100% + 0.7cm)) !important;
    min-width: 88px;
    max-width: 115px;
  }

  .contenedor-cert-director .duracion-certificado,
  .contenedor-cert-director .fecha-certificado {
    font-size: clamp(8px, 2.1vw, 12px);
    margin-top: -3px;
    margin-bottom: 5px;
  }

  .contenedor-cert-director .fecha-certificado {
    margin-top: 0;
  }

  .contenedor-cert-director .contenido-central {
    left: 50%;
    padding: 0 10% 0 10%;
  }

  .contenedor-cert-director .contenido-central.nombre-largo {
    top: 55%;
    transform: translate(-50%, -48%);
    padding: 0 10% 0 10%;
  }

  .contenedor-cert-director .contenido-central.nombre-muy-largo {
    top: 55.5%;
    transform: translate(-50%, -46%);
    padding: 0 10% 0 10%;
  }

  .contenedor-cert-director .contenido-central.nombre-largo .texto-exitoso,
  .contenedor-cert-director .contenido-central.nombre-muy-largo .texto-exitoso {
    margin-bottom: 2px;
  }

  .contenedor-cert-director .contenido-central.nombre-largo .titulo-capacitacion,
  .contenedor-cert-director .contenido-central.nombre-muy-largo .titulo-capacitacion {
    margin-bottom: 3px;
  }

  .contenedor-cert-director .nombre-participante.nombre-largo {
    margin-top: 0.35cm;
    margin-bottom: 8px;
  }

  .contenedor-cert-director .nombre-participante.nombre-muy-largo {
    margin-top: 0.2cm;
    margin-bottom: 6px;
  }

  .contenedor-cert-director .nombre-participante:not(.nombre-largo):not(.nombre-muy-largo) {
    margin-top: 0.7cm;
    margin-left: -1cm;
  }

  .contenedor-cert-director .nombre-participante.nombre-largo,
  .contenedor-cert-director .nombre-participante.nombre-muy-largo {
    margin-left: -1cm;
  }

  .contenedor-cert-director .texto-exitoso,
  .contenedor-cert-director .titulo-capacitacion,
  .contenedor-cert-director .duracion-certificado,
  .contenedor-cert-director .fecha-certificado {
    margin-left: -1cm;
  }

  .contenedor-cert-director .titulo-capacitacion {
    padding-left: 4%;
    padding-right: 4%;
  }

  .contenedor-cert-director .firma-director.nombre-largo.firma-electronica-container,
  .contenedor-cert-director .firma-director.nombre-muy-largo.firma-electronica-container {
    top: 76.5% !important;
    left: 57% !important;
    transform: translate(calc(-50% - 0.5cm), calc(-100% + 0.65cm)) !important;
  }

  .contenedor-cert-director .firma-ec-qr {
    position: relative;
    top: -6px;
    left: 10px;
  }

  .firma-img {
    max-height: 26px;
  }
}

/* Pantallas grandes */
@media screen and (min-width: 1920px) {
  .contenido-central {
    max-width: 1200px;
    padding: 0 10% 0 6%;
  }

  .nombre-participante {
    font-size: 52px;
  }

  .texto-exitoso {
    font-size: 42px;
  }

  .titulo-capacitacion {
    font-size: 42px;
    margin-bottom: 6px;
  }

  .duracion-certificado {
    font-size: 26px;
    margin-top: -8px;
  }

  .fecha-certificado {
    font-size: 24px;
    margin-top: 2px;
  }

  .firma-container {
    width: 16%;
    max-width: 220px;
  }

  .firma-img {
    max-height: 100px;
  }
}
</style>
