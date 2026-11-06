<template>
  <i :class="iconClass" :style="iconStyle"></i>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '1em'
    },
    color: {
      type: String,
      default: '#60a5fa'  // Azul claro por defecto
    }
  },
  computed: {
    iconClass() {
      const iconMap = {
        // Dashboard & Analytics
        'chart': 'fas fa-chart-bar',
        'chart-pie': 'fas fa-chart-pie',
        'analytics': 'fas fa-chart-line',
        'dashboard': 'fas fa-tachometer-alt',
        
        // Acciones
        'plus': 'fas fa-plus',
        'add': 'fas fa-plus-circle',
        'edit': 'fas fa-edit',
        'delete': 'fas fa-trash',
        'trash': 'fas fa-trash-alt',
        'copy': 'fas fa-copy',
        'duplicate': 'fas fa-clone',
        'save': 'fas fa-save',
        'cancel': 'fas fa-times',
        'close': 'fas fa-times-circle',
        
        // Navegación
        'arrow-left': 'fas fa-arrow-left',
        'arrow-right': 'fas fa-arrow-right',
        'arrow-up': 'fas fa-arrow-up',
        'arrow-down': 'fas fa-arrow-down',
        'back': 'fas fa-chevron-left',
        'next': 'fas fa-chevron-right',
        
        // Estados
        'check': 'fas fa-check',
        'check-circle': 'fas fa-check-circle',
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle',
        
        // Configuración
        'settings': 'fas fa-cog',
        'config': 'fas fa-sliders-h',
        'filter': 'fas fa-filter',
        
        // Contenido
        'book': 'fas fa-book',
        'books': 'fas fa-books',
        'file': 'fas fa-file',
        'folder': 'fas fa-folder',
        'document': 'fas fa-file-alt',
        'pdf': 'fas fa-file-pdf',
        'image': 'fas fa-image',
        'video': 'fas fa-video',
        'link': 'fas fa-link',
        
        // Educación
        'graduation': 'fas fa-graduation-cap',
        'trophy': 'fas fa-trophy',
        'certificate': 'fas fa-certificate',
        'award': 'fas fa-award',
        'medal': 'fas fa-medal',
        'star': 'fas fa-star',
        
        // Usuarios
        'user': 'fas fa-user',
        'users': 'fas fa-users',
        'user-circle': 'fas fa-user-circle',
        'user-plus': 'fas fa-user-plus',
        
        // Capacitaciones
        'question': 'fas fa-question-circle',
        'questions': 'fas fa-question',
        'answer': 'fas fa-reply',
        'quiz': 'fas fa-clipboard-list',
        
        // Tiempo
        'clock': 'fas fa-clock',
        'calendar': 'fas fa-calendar',
        'calendar-alt': 'fas fa-calendar-alt',
        'hourglass': 'fas fa-hourglass-half',
        'timer': 'fas fa-stopwatch',
        
        // Actividad
        'play': 'fas fa-play',
        'pause': 'fas fa-pause',
        'stop': 'fas fa-stop',
        'refresh': 'fas fa-sync-alt',
        'redo': 'fas fa-redo',
        'undo': 'fas fa-undo',
        
        // Visibilidad
        'eye': 'fas fa-eye',
        'eye-slash': 'fas fa-eye-slash',
        'visible': 'fas fa-eye',
        'hidden': 'fas fa-eye-slash',
        
        // Ubicación/Alcance
        'globe': 'fas fa-globe',
        'building': 'fas fa-building',
        'company': 'fas fa-building',
        'department': 'fas fa-sitemap',
        
        // Objetivos
        'target': 'fas fa-bullseye',
        'goal': 'fas fa-flag-checkered',
        'rocket': 'fas fa-rocket',
        
        // Comunicación
        'pen': 'fas fa-pen',
        'pencil': 'fas fa-pencil-alt',
        'signature': 'fas fa-signature',
        'comment': 'fas fa-comment',
        'comments': 'fas fa-comments',
        
        // Descarga/Upload
        'download': 'fas fa-download',
        'upload': 'fas fa-upload',
        'cloud-download': 'fas fa-cloud-download-alt',
        'cloud-upload': 'fas fa-cloud-upload-alt',
        
        // Listas
        'list': 'fas fa-list',
        'list-ul': 'fas fa-list-ul',
        'list-ol': 'fas fa-list-ol',
        'tasks': 'fas fa-tasks',
        
        // Búsqueda
        'search': 'fas fa-search',
        'search-plus': 'fas fa-search-plus',
        'search-minus': 'fas fa-search-minus',
        
        // Lock/Security
        'lock': 'fas fa-lock',
        'unlock': 'fas fa-unlock',
        'key': 'fas fa-key',
        'shield': 'fas fa-shield-alt',
        
        // Otros
        'dots-vertical': 'fas fa-ellipsis-v',
        'dots-horizontal': 'fas fa-ellipsis-h',
        'menu': 'fas fa-bars',
        'grid': 'fas fa-th',
        'table': 'fas fa-table',
        'print': 'fas fa-print',
        'qr': 'fas fa-qrcode',
        'barcode': 'fas fa-barcode',
        'tag': 'fas fa-tag',
        'tags': 'fas fa-tags',
        'bell': 'fas fa-bell',
        'envelope': 'fas fa-envelope',
        'phone': 'fas fa-phone',
        'home': 'fas fa-home',
        'heart': 'fas fa-heart',
        'thumbs-up': 'fas fa-thumbs-up',
        'thumbs-down': 'fas fa-thumbs-down',
        'scroll': 'fas fa-scroll',
        'clipboard': 'fas fa-clipboard'
      };

      return iconMap[this.name] || 'fas fa-question-circle';
    },
    iconStyle() {
      return {
        fontSize: this.size,
        color: this.color
      };
    }
  }
};
</script>

<style scoped>
i {
  display: inline-block;
  vertical-align: middle;
}
</style>
