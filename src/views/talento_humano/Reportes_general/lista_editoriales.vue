<template>
  <vx-card fixed-height="true">
    <!-- ================================================================
         CABECERA: Título y acciones principales
    ================================================================= -->
    <div class="hik-header mb-4">
      <div class="hik-header__title">
        <feather-icon icon="WatchIcon" svgClasses="h-6 w-6 text-primary mr-2" />
        <h4 class="mb-0">Reportes de Timbraje — Hik-Connect</h4>
      </div>
      <div class="hik-header__actions">
        <vs-button
          color="warning"
          type="border"
          icon="search"
          class="mr-2"
          @click="diagnosticarConexion()"
          title="Ver diagnóstico detallado de la conexión"
        >Diagnóstico</vs-button>

      </div>
    </div>

    <!-- ================================================================
         FILTROS DE BÚSQUEDA
    ================================================================= -->
    <vs-card class="hik-filtros mb-4">
      <div class="hik-filtros__grid">
        <!-- Fecha Inicio -->
        <div class="hik-filtros__item">
          <label class="hik-label">Fecha Inicio</label>
          <vs-input
            type="date"
            v-model="filtros.fechaInicio"
            class="w-full"
          />
        </div>
        <!-- Fecha Fin -->
        <div class="hik-filtros__item">
          <label class="hik-label">Fecha Fin</label>
          <vs-input
            type="date"
            v-model="filtros.fechaFin"
            class="w-full"
          />
        </div>
        <!-- Nombre persona (opcional) -->
        <div class="hik-filtros__item">
          <label class="hik-label">Nombre Persona (opcional)</label>
          <vs-input
            placeholder="Buscar persona..."
            v-model="filtros.personName"
            icon="search"
            icon-after="true"
            class="w-full"
            @keyup.enter="buscarTimbraje()"
          />
        </div>
        <!-- Modo reporte -->
        <div class="hik-filtros__item">
          <label class="hik-label">Tipo de Reporte</label>
          <ul class="flex mt-2">
            <li>
              <vs-radio v-model="modoReporte" vs-name="modoReporte" vs-value="timbraje" class="mr-3">
                Timbraje (Acceso)
              </vs-radio>
            </li>
            <li>
              <vs-radio v-model="modoReporte" vs-name="modoReporte" vs-value="asistencia">
                Asistencia Procesada
              </vs-radio>
            </li>
          </ul>
        </div>
        <!-- Botón buscar -->
        <div class="hik-filtros__item hik-filtros__item--actions">
          <vs-button
            color="primary"
            type="filled"
            icon="search"
            @click="buscarTimbraje()"
            class="w-full"
          >Consultar Reportes</vs-button>
        </div>
      </div>
    </vs-card>

    <!-- ================================================================
         TABLA DE RESULTADOS
    ================================================================= -->
    <vs-table
      max-items="15"
      pagination
      search
      :data="registros"
      no-data-text="No hay registros de timbraje para los filtros seleccionados"
    >
      <!-- Cabecera con contadores -->
      <template slot="header">
        <div class="flex items-center">
          <vs-chip color="primary" class="mr-2">
            Total registros: <b class="ml-1">{{ totalRegistros }}</b>
          </vs-chip>
          <vs-chip v-if="registros.length > 0" color="success">
            Página {{ paginaActual }} — Mostrando {{ registros.length }}
          </vs-chip>
        </div>
      </template>

      <!-- Columnas de la tabla (modo Timbraje) -->
      <template slot="thead" v-if="modoReporte === 'timbraje'">
        <vs-th width="60">#</vs-th>
        <vs-th width="180">Persona</vs-th>
        <vs-th width="140">N° Documento</vs-th>
        <vs-th width="180">Fecha/Hora Evento</vs-th>
        <vs-th width="150">Punto de Acceso</vs-th>
        <vs-th width="120">Tipo Evento</vs-th>
        <vs-th width="100">Resultado</vs-th>
      </template>

      <!-- Columnas de la tabla (modo Asistencia) -->
      <template slot="thead" v-else>
        <vs-th width="60">#</vs-th>
        <vs-th width="200">Persona</vs-th>
        <vs-th width="140">N° Documento</vs-th>
        <vs-th width="160">Periodo</vs-th>
        <vs-th width="120">Tiempo Total (h)</vs-th>
        <vs-th width="120">Días Trabajados</vs-th>
        <vs-th width="120">Ausencias</vs-th>
      </template>

      <!-- Filas (modo Timbraje) -->
      <template slot-scope="{ data }" v-if="modoReporte === 'timbraje'">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{ ((paginaActual - 1) * filtros.pageSize) + indextr + 1 }}</vs-td>
          <vs-td>
            <div class="flex items-center">
              <vs-avatar
                :text="obtenerIniciales(tr.personName || tr.name || '')"
                color="primary"
                class="mr-2"
                size="32px"
              />
              <span>{{ tr.personName || tr.name || 'Desconocido' }}</span>
            </div>
          </vs-td>
          <vs-td>{{ tr.cardNo || tr.certificateNo || tr.employeeNo || '—' }}</vs-td>
          <vs-td>
            <vs-chip color="dark">
              {{ formatearFecha(tr.eventTime || tr.time || tr.triggerTime) }}
            </vs-chip>
          </vs-td>
          <vs-td>{{ tr.accessPointName || tr.doorName || tr.deviceName || '—' }}</vs-td>
          <vs-td>
            <vs-chip :color="colorTipoEvento(tr.eventType || tr.type)">
              {{ tr.eventTypeName || tr.eventType || tr.type || '—' }}
            </vs-chip>
          </vs-td>
          <vs-td>
            <vs-chip :color="tr.result === 1 || tr.result === 'success' ? 'success' : 'warning'">
              {{ tr.result === 1 || tr.result === 'success' ? '✓ OK' : (tr.result || '—') }}
            </vs-chip>
          </vs-td>
        </vs-tr>
      </template>

      <!-- Filas (modo Asistencia) -->
      <template slot-scope="{ data }" v-else>
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{ indextr + 1 }}</vs-td>
          <vs-td>
            <div class="flex items-center">
              <vs-avatar
                :text="obtenerIniciales(tr.personName || tr.name || '')"
                color="warning"
                class="mr-2"
                size="32px"
              />
              <span>{{ tr.personName || tr.name || 'Desconocido' }}</span>
            </div>
          </vs-td>
          <vs-td>{{ tr.employeeNo || tr.cardNo || '—' }}</vs-td>
          <vs-td>
            <small>
              {{ formatearFecha(tr.startTime) }} — {{ formatearFecha(tr.endTime) }}
            </small>
          </vs-td>
          <vs-td>
            <b class="text-primary">{{ tr.totalWorkTime || tr.workDuration || '—' }}</b>
          </vs-td>
          <vs-td>{{ tr.workDays || '—' }}</vs-td>
          <vs-td>
            <vs-chip :color="(tr.absentDays > 0) ? 'danger' : 'success'">
              {{ tr.absentDays || 0 }} días
            </vs-chip>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <!-- ================================================================
         PAGINACIÓN MANUAL (si hay más páginas)
    ================================================================= -->
    <div class="hik-paginacion mt-4" v-if="totalRegistros > filtros.pageSize">
      <vs-button
        type="border"
        icon="chevron_left"
        :disabled="paginaActual <= 1"
        @click="cambiarPagina(paginaActual - 1)"
        class="mr-2"
      >Anterior</vs-button>
      <vs-chip color="primary">Página {{ paginaActual }} de {{ totalPaginas }}</vs-chip>
      <vs-button
        type="border"
        icon="chevron_right"
        :disabled="paginaActual >= totalPaginas"
        @click="cambiarPagina(paginaActual + 1)"
        class="ml-2"
      >Siguiente</vs-button>
    </div>

    <!-- ================================================================
         SECCIÓN DEBUG: Respuesta RAW de la API (solo en modo debug)
    ================================================================= -->
    <vs-collapse v-if="rawResponse" class="mt-4">
      <vs-collapse-item>
        <div slot="header" class="flex items-center">
          <feather-icon icon="CodeIcon" svgClasses="h-4 w-4 mr-2 text-warning" />
          <span>Ver respuesta RAW de la API (Debug)</span>
        </div>
        <pre class="hik-raw-response">{{ JSON.stringify(rawResponse, null, 2) }}</pre>
      </vs-collapse-item>
    </vs-collapse>

  </vx-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'HikConnect_ReportesTimbraje',
  data() {
    return {


      // Filtros de búsqueda
      filtros: {
        fechaInicio: this.obtenerFechaHoy(),
        fechaFin:    this.obtenerFechaHoy(),
        personName:  '',
        pageSize:    50,
      },

      // Modo de reporte: 'timbraje' | 'asistencia'
      modoReporte: 'timbraje',

      // Resultados
      registros:      [],
      totalRegistros: 0,
      paginaActual:   1,
      rawResponse:    null,
    };
  },

  computed: {
    ...mapState(['auth', 'userRoot', 'susuario']),

    totalPaginas() {
      if (!this.filtros.pageSize || this.filtros.pageSize === 0) return 1;
      return Math.ceil(this.totalRegistros / this.filtros.pageSize);
    },
  },



  methods: {
    // ------------------------------------------------------------------
    //  Utilidad: fecha de hoy en formato YYYY-MM-DD
    // ------------------------------------------------------------------
    obtenerFechaHoy() {
      const hoy = new Date();
      return hoy.toISOString().split('T')[0];
    },

    // ------------------------------------------------------------------
    //  Diagnóstico de conexión con Hik-Connect
    // ------------------------------------------------------------------
    diagnosticarConexion() {
      const me = this;
      me.$vs.loading();
      me.rawResponse = null;

      me.$http.get(me.$server_url + 'api/HikConnect_MetodosGet', {
        params: { action: 'DiagnosticarConexion' },
      })
        .then(res => {
          me.$vs.loading.close();
          me.rawResponse = res.data;

          // Analizar resultados
          const intentos = res.data.intentos || [];
          const exitoso = intentos.find(i => i.http_status && i.http_status >= 200 && i.http_status < 300);
          const sinConexion = intentos.every(i => i.error);

          if (exitoso) {
            me.$vs.notify({
              title:    '✓ Conexión exitosa',
              text:     `Variante "${exitoso.variante}" respondió HTTP ${exitoso.http_status}. Revisa el panel RAW.`,
              color:    'success',
              iconPack: 'feather',
              icon:     'icon-check',
            });
          } else if (sinConexion) {
            const primerError = (intentos[0] && intentos[0].error) || 'Error desconocido';
            me.$vs.notify({
              title:    '✗ Sin conexión',
              text:     'No se puede conectar a ' + (res.data.env_cargadas && res.data.env_cargadas.HIK_CONNECT_BASE_URL) + '. Error: ' + primerError,
              color:    'danger',
              iconPack: 'feather',
              icon:     'icon-x',
              time:     8000,
            });
          } else {
            me.$vs.notify({
              title:    'Diagnóstico listo',
              text:     'Revisa el panel RAW para ver los detalles de la conexión',
              color:    'warning',
              iconPack: 'feather',
              icon:     'icon-info',
            });
          }
        })
        .catch(err => {
          me.$vs.loading.close();
          console.error(err);
          me.$vs.notify({
            title:    'Error de diagnóstico',
            text:     'No se pudo ejecutar el diagnóstico',
            color:    'danger',
            iconPack: 'feather',
            icon:     'icon-x',
          });
        });
    },



    // ------------------------------------------------------------------
    //  Consultar reportes de timbraje o asistencia
    // ------------------------------------------------------------------
    buscarTimbraje() {
      const me = this;

      // Validar fechas
      if (!me.filtros.fechaInicio || !me.filtros.fechaFin) {
        me.$vs.notify({
          text:     'Debes seleccionar una fecha de inicio y fin',
          color:    'warning',
          iconPack: 'feather',
          icon:     'icon-alert-triangle',
        });
        return;
      }

      me.$vs.loading();
      me.registros    = [];
      me.rawResponse  = null;
      me.paginaActual = 1;

      // Construir fechas en formato ISO 8601
      const startTime = `${me.filtros.fechaInicio}T00:00:00`;
      const endTime   = `${me.filtros.fechaFin}T23:59:59`;

      const action = me.modoReporte === 'timbraje'
        ? 'GetReportesTimbraje'
        : 'GetReportesAsistencia';

      const params = {
        action,
        startTime,
        endTime,
        pageNo: me.paginaActual,
        pageSize:  me.filtros.pageSize,
      };

      if (me.filtros.personName && me.filtros.personName.trim().length > 0) {
        params.personName = me.filtros.personName.trim();
      }

      me.$http.get(me.$server_url + 'api/HikConnect_MetodosGet', { params })
        .then(res => {
          me.$vs.loading.close();
          const data = res.data;

          if (data.status === 1) {
            me.registros      = data.registros || [];
            me.totalRegistros = data.total || me.registros.length;
            me.rawResponse    = data.raw || null;
          } else if (data.status === 'error_firma') {
            me.rawResponse = data;
            me.$vs.notify({
              title:    'Error de Autenticación',
              text:     'Firma HMAC incorrecta. Verifica credenciales (APP_KEY, APP_SECRET).',
              color:    'warning',
              iconPack: 'feather',
              icon:     'icon-alert-circle',
            });
          } else {
            me.rawResponse = data;
            me.$vs.notify({
              title:    'Error en la consulta',
              text:     data.message || 'Revisa la respuesta RAW de la API',
              color:    'danger',
              iconPack: 'feather',
              icon:     'icon-x',
            });
          }
        })
        .catch(err => {
          me.$vs.loading.close();
          console.error('Error Hik-Connect:', err);
          me.$vs.notify({
            title:    'Error de conexión',
            text:     'No se pudo conectar con el servidor backend',
            color:    'danger',
            iconPack: 'feather',
            icon:     'icon-x',
          });
        });
    },

    // ------------------------------------------------------------------
    //  Cambiar de página
    // ------------------------------------------------------------------
    cambiarPagina(nuevaPagina) {
      const me = this;
      me.paginaActual = nuevaPagina;

      const startTime = `${me.filtros.fechaInicio}T00:00:00`;
      const endTime   = `${me.filtros.fechaFin}T23:59:59`;
      const action    = me.modoReporte === 'timbraje' ? 'GetReportesTimbraje' : 'GetReportesAsistencia';

      me.$vs.loading();
      me.$http.get(me.$server_url + 'HikConnect_MetodosGet', {
        params: {
          action,
          startTime,
          endTime,
          pageNo: nuevaPagina,
          pageSize:  me.filtros.pageSize,
          personName: me.filtros.personName || undefined,
        },
      })
        .then(res => {
          me.$vs.loading.close();
          if (res.data.status === 1) {
            me.registros      = res.data.registros || [];
            me.totalRegistros = res.data.total || me.registros.length;
            me.rawResponse    = res.data.raw || null;
          }
        })
        .catch(err => {
          me.$vs.loading.close();
          console.error(err);
        });
    },

    // ------------------------------------------------------------------
    //  Utilidades de formato
    // ------------------------------------------------------------------
    formatearFecha(valor) {
      if (!valor) return '—';
      try {
        const fecha = new Date(valor);
        if (isNaN(fecha.getTime())) return valor;
        return fecha.toLocaleString('es-EC', {
          year:   'numeric',
          month:  '2-digit',
          day:    '2-digit',
          hour:   '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      } catch {
        return valor;
      }
    },

    obtenerIniciales(nombre) {
      if (!nombre) return '?';
      return nombre
        .split(' ')
        .slice(0, 2)
        .map(p => p[0])
        .join('')
        .toUpperCase();
    },

    colorTipoEvento(tipo) {
      if (!tipo) return 'dark';
      const t = String(tipo).toLowerCase();
      if (t.includes('entry') || t.includes('entrada') || t.includes('in'))  return 'success';
      if (t.includes('exit')  || t.includes('salida')  || t.includes('out')) return 'warning';
      if (t.includes('fail')  || t.includes('error')   || t.includes('deny')) return 'danger';
      return 'primary';
    },
  },
};
</script>

<style scoped>
/* ================================================================
   ESTILOS: Módulo Hik-Connect Reportes de Timbraje
================================================================= */

.hik-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.hik-header__title {
  display: flex;
  align-items: center;
}

.hik-header__title h4 {
  font-weight: 600;
  color: var(--vs-primary);
}

.hik-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Filtros */
.hik-filtros {
  background: rgba(var(--vs-primary), 0.03);
}

.hik-filtros__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  align-items: end;
}

.hik-filtros__item--actions {
  display: flex;
  align-items: flex-end;
}

.hik-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Paginación */
.hik-paginacion {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Debug RAW */
.hik-raw-response {
  background: #1e1e2e;
  color: #a6e3a1;
  padding: 16px;
  border-radius: 8px;
  font-size: 11px;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}
</style>
