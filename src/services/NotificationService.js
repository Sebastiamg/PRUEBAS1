// services/NotificationService.js

export default class NotificationService {
    constructor(channelName, eventName, onNotificationReceived) {
      this.channelName = channelName;
      this.eventName = eventName;
      this.onNotificationReceived = onNotificationReceived;
      this.pusher = null;
      this.channel = null;
    }
  
    // Método para iniciar la conexión y suscripción a Pusher
    startListening() {
      // Solo se crea una conexión si aún no existe
      if (!this.pusher) {
        this.pusher = new Pusher('67ad293a1345b6955bf0', {
          cluster: 'us2',
          encrypted: true,
        });
      }
  
      // Suscripción al canal
      this.channel = this.pusher.subscribe(this.channelName);
  
      // Configurar el evento que queremos escuchar
      this.channel.bind(this.eventName, this.handleEvent.bind(this));
    }
  
    // Método que maneja los eventos recibidos
    handleEvent(data) {
      console.log('Notificación recibida:', data);
      if (this.onNotificationReceived) {
        this.onNotificationReceived(data); // Llama a la función pasada como callback
      }
    }
  
    // Método para cancelar la suscripción y liberar recursos
    stopListening() {
      if (this.channel) {
        this.pusher.unsubscribe(this.channelName); // Des-suscribirse del canal
      }
    }
  }
  