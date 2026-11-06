<template>
  <div>
    <vx-card>
      <vs-tabs v-model="activeTab">
        <vs-tab label="Tipo de Reportes" @click="MenuSelectedLocalStorage()">
          <lista_tipo_reportes />
        </vs-tab>
        <vs-tab label="Departamentos Prolipa" @click="MenuSelectedLocalStorage()">
          <lista_departamentos />
        </vs-tab>
        <vs-tab label="Cargos Prolipa" @click="MenuSelectedLocalStorage()">
          <cargos_prolipa />
        </vs-tab>
      </vs-tabs>
    </vx-card>
  </div>
</template>

<script>
const lista_tipo_reportes = () => import('@/views/talento_humano/configuracion/tipo_reportes/lista_tipo_reportes.vue')
const lista_departamentos = () => import('@/views/talento_humano/configuracion/departamentos_prolipa/lista_departamentos_prolipa.vue')
const cargos_prolipa = () => import('@/views/talento_humano/configuracion/cargos_prolipa/lista_cargosprolipa.vue')
export default {
  data() {
    // Usa la misma key unificada talento_humano_menus
    let stored = null
    try {
      stored = JSON.parse(localStorage.getItem('talento_humano_menus'))
    } catch (error) {
      console.error('Error parsing localStorage item "talento_humano_menus":', error)
    }
    if (!stored) {
      stored = { menu: 1, submenu: 0, subsubmenu: 0 }
      localStorage.setItem('talento_humano_menus', JSON.stringify(stored))
    }
    return {
      activeTab: stored.submenu || 0,
      menulocalstorage: stored
    }
  },
  methods: {
    MenuSelectedLocalStorage() {
      this.menulocalstorage.submenu = this.activeTab
      localStorage.setItem('talento_humano_menus', JSON.stringify(this.menulocalstorage))
    }
  },
  components: {
    lista_tipo_reportes,
    lista_departamentos,
    cargos_prolipa
  }
}
</script>
